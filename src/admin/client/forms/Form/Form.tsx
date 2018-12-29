import { omit } from 'lodash';
import * as React from 'react';
import { ValueInterceptor, ValueInterceptorContext } from '../ValueInterceptor';
import { FormContext, FormContextValue } from './FormContext';
import { FormState } from './FormState';
import { FormFieldMeta } from './FormFieldMeta';
import { ValidateCallback } from './ValidateCallback';


export interface FormProps {
    children: React.ReactNode,
    formState: FormState,
    onChange: (newState: FormState) => void,
    onSubmit?: (value: object) => void,
}

export default class Form extends React.Component<FormProps, {}> {
    pendingRegistrations: Array<{ path: string, validateCallback: ValidateCallback }> = []
    pendingDeregistrations: Array<string> = [];
    changeQueue: string[] = []
    formChildContext: FormContextValue
    valueInterceptorChildContext: ValueInterceptor


    constructor(props: FormProps) {
        super(props);

        this.formChildContext = {
            register: this.registerChild,
            deregister: this.deregisterChild,
            addToChangeQueue: this.addToChangeQueue,
            parentPath: ''
        }

        this.valueInterceptorChildContext = {
            getValue: this.getChildValue,
            onChangeInterceptor: this.onChildChange,
        }
    }

    registerChild = (path: string, validateCallback: ValidateCallback) => {
        this.pendingRegistrations.push({
            path,
            validateCallback,
        });
    }

    deregisterChild = (path: string) => {
        this.pendingDeregistrations.push(path);
    }

    componentDidMount() {
        const { formState } = this.props;

        const newFormState = this.processRegistrations();

        this.props.onChange(newFormState);
    }

    componentDidUpdate(prevProps: FormProps) {
        let currentFormState = this.props.formState;
        let shouldSetFormState = false;
        if (this.pendingRegistrations.length > 0 || this.pendingDeregistrations.length > 0) {
            currentFormState = this.processRegistrations();
            shouldSetFormState = true;
        }

        if (!prevProps.formState.pendingValidation && this.props.formState.pendingValidation) {
            shouldSetFormState = true;
            const fields = currentFormState.fields;

            const pendingFields = Object.entries(fields)
                .filter(([, field]) => field.pendingValidation)
                .map(([key]) => key);

            currentFormState = this.validateByField(pendingFields, currentFormState);
        }

        if (shouldSetFormState) {
            this.props.onChange(currentFormState);
        }
    }

    processRegistrations() {
        const { formState } = this.props;

        const currentFields = formState.fields;
        let newFieldMeta = this.pendingRegistrations.reduce((agg, registration) => {
            const pathKey = registration.path;
            let currentFieldMeta = agg[pathKey];
            if (!currentFieldMeta) {
                currentFieldMeta = {
                    isPristine: true,
                    isValid: true,
                    pendingValidation: true,
                    errors: undefined,
                    validate: registration.validateCallback,
                    children: new Set(),
                }
            }
            else {
                currentFieldMeta.validate = registration.validateCallback;
            }

            agg[pathKey] = currentFieldMeta;
            return agg;

        }, currentFields);

        newFieldMeta = this.pendingDeregistrations.reduce((agg, pathToDeregister) => {
            const fields = Object.keys(agg).filter(fieldKey => fieldKey.startsWith(pathToDeregister));
            return omit(agg, ...fields);
        }, newFieldMeta)

        this.pendingRegistrations = [];
        this.pendingDeregistrations = [];

        // Completely rebuild children after processing registrations
        // It's much easier this way than trying to use a weak set to not have to worry about a memory leak
        // Where you still have a reference to the old object 
        Object.values(newFieldMeta)
            .forEach((fieldMeta) => {
                fieldMeta.children.clear();
            })

        Object.entries(newFieldMeta)
            .forEach(([fieldName, fieldMeta]) => {
                const splitPath = fieldName.split('.');
                if (splitPath.length == 1) {
                    // root level, no parent
                    return;
                }

                splitPath.pop();
                const parentPath = splitPath.join('.');
                newFieldMeta[parentPath].children.add(fieldMeta);
            })

        return {
            ...formState,
            pendingValidation: true,
            fields: newFieldMeta,
        };
    }

    onChildChange = (childName: string, newValue: any) => {
        if (newValue.target && newValue.target instanceof HTMLElement) {
            newValue = newValue.target.value;
        }

        const newFieldMeta = this.changeQueue.reduce((agg, field) => {
            agg[field].isPristine = false;
            agg[field].pendingValidation = true;
            return agg;
        }, { ...this.props.formState.fields })

        this.changeQueue = [];

        this.props.onChange({
            ...this.props.formState,
            isPristine: false,
            pendingValidation: true,
            value: {
                ...this.props.formState.value,
                [childName]: newValue
            },
            fields: newFieldMeta
        });
    }

    getChildValue = (fieldName: string) => {
        if (this.props.formState && this.props.formState.value) {
            return this.props.formState.value[fieldName];
        }
    }

    validate() {
        const newFormState = this.validateByField(Object.keys(this.props.formState.fields), this.props.formState);
        this.props.onChange(newFormState);
    }

    validateByField(fields: string[], formState: FormState) {

        const rawValidationResults = fields
            .reduce((agg, fieldName) => {
                const result = formState.fields[fieldName].validate();
                const depth = fieldName.split('.').length - 1;
                if(!agg[depth]){
                    agg[depth] = {} as { [key: string]: { [validatorKey: string]: boolean } }
                }
                agg[depth][fieldName] = result;
                return agg;
            }, [] as Array<{ [fieldName: string]: { [validatorKey: string]: boolean } }>)

            

        const newFieldState = this.processValidationResults(formState.fields, rawValidationResults);

        const formIsValid = Object.values(newFieldState).every((field) => field.isValid);

        return {
            ...formState,
            pendingValidation: false,
            isValid: formIsValid,
            fields: newFieldState
        };
    }

    processValidationResults(
        currentFieldState: FormState['fields'],
        rawValidationResults: Array<{ [fieldName: string]: { [validatorKey: string]: boolean } }>
    ): FormState['fields'] {
        let newFieldState = { ...currentFieldState };

        // Process deepest first so that by the time it comes to check if all children are valid
        // then all children are already done validating if necessary
        for (let i = rawValidationResults.length - 1; i >= 0; i--) {
            const resultsForDepth = rawValidationResults[i];

            newFieldState = Object.entries(resultsForDepth)
                .reduce((agg, [fieldName, validationResult]) => {
                    let allValid = true;
                    let errors: { [errorKey: string]: boolean } = {};

                    Object.entries(validationResult)
                        .forEach(([key, isValid]) => {
                            allValid = allValid && isValid;

                            if (!isValid) {
                                errors[key] = true;
                            }
                        });

                    const fieldMeta = agg[fieldName];
                    fieldMeta.errors = allValid ? undefined : errors

                    if(fieldMeta.children.size > 0) {
                        allValid = allValid && Array.from(fieldMeta.children.values()).every(c => c.isValid)
                    }

                    fieldMeta.pendingValidation = false;
                    fieldMeta.isValid = allValid;
                    

                    return agg;
                }, newFieldState);

        }

        return newFieldState
    }

    addToChangeQueue = (fieldName: string) => {
        this.changeQueue.push(fieldName);
    }

    onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (this.props.formState.isValid && this.props.onSubmit) {
            this.props.onSubmit(this.props.formState.value);
        }
    }

    render() {
        return (
            <FormContext.Provider value={this.formChildContext}>
                <ValueInterceptorContext.Provider value={this.valueInterceptorChildContext}>
                    <form onSubmit={this.onFormSubmit}>
                        {this.props.children}
                    </form>
                </ValueInterceptorContext.Provider>
            </FormContext.Provider>
        );
    }
}