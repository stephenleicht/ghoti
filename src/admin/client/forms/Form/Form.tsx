import * as React from 'react';
import { ValueInterceptor, ValueInterceptorContext } from '../ValueInterceptor';
import { FormContext, FormContextValue } from './FormContext';
import { FormState } from './FormState';
import { ValidateCallback } from './ValidateCallback';
import { FormErrorMap } from '../errors/FormErrorMap';
import { omit } from '../utils';


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
            setTouched: this.setTouched,
            addToChangeQueue: this.addToChangeQueue,
            getErrors: this.getErrorsForField,
            getIsTouched: this.getIsTouchedForField,
            getHasSubmitted: this.getHasSubmitted,
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

    setTouched = (path: string, isTouched: boolean) => {
        const newFormState = {
            ...this.props.formState,
            fields: {
                ...this.props.formState.fields,
                [path]: {
                    ...this.props.formState.fields[path],
                    isTouched
                }
            }
        }

        this.props.onChange(newFormState);
    }

    componentDidMount() {
        const newFormState = this.processRegistrations();
        this.props.onChange(newFormState);
    }

    componentDidUpdate(prevProps: FormProps) {
        let currentFormState = this.props.formState;
        if (this.pendingRegistrations.length > 0 || this.pendingDeregistrations.length > 0) {
            currentFormState = this.processRegistrations();
        }

        // Because of the way I wanted to keep the field state as tracked metadata, but the value to be passed down naturally
        // to each component means that you can't validate until the form is updated with the new values and at that point
        // is in an unknown validation state. Waiting for the form to be updated to be able to validate causes any 
        // validations to issue a second onChange call back after every change. This seems like a code smell and should
        // be addressed in the future
        //
        // TOOD: Possibly throttle/debounce validations to not happen to quickly so as to keep the number of validation
        // passes down. This will become important with async validators.
        if (!prevProps.formState.pendingValidation && this.props.formState.pendingValidation) {
            currentFormState = this.validatePendingFields(currentFormState);
        }

        if (currentFormState !== this.props.formState) {
            this.props.onChange(currentFormState);
        }
    }

    processRegistrations(): FormState {
        const { formState } = this.props;

        let newFieldMeta = { ...formState.fields };
        newFieldMeta = this.pendingRegistrations.reduce((agg, registration) => {
            const pathKey = registration.path;
            let currentFieldMeta = agg[pathKey];
            if (!currentFieldMeta) {
                currentFieldMeta = {
                    isPristine: true,
                    isValid: true,
                    isTouched: false,
                    pendingValidation: true,
                    errors: undefined,
                    validate: registration.validateCallback,
                    children: new Set(),
                }
            }
            else {
                currentFieldMeta = {
                    ...currentFieldMeta,
                    validate: registration.validateCallback
                };
            }

            agg[pathKey] = currentFieldMeta;
            return agg;

        }, newFieldMeta);

        newFieldMeta = this.pendingDeregistrations.reduce((agg, pathToDeregister) => {
            const fields = Object.keys(agg).filter(fieldKey => fieldKey.startsWith(pathToDeregister));
            return omit(agg, ...fields);
        }, newFieldMeta)

        this.pendingRegistrations = [];
        this.pendingDeregistrations = [];

        this.processChildren(newFieldMeta);

        return {
            ...formState,
            pendingValidation: true,
            fields: newFieldMeta,
        };
    }

    processChildren(fieldMeta: FormState['fields']) {
        // Completely rebuild children each time
        // It's much easier this way than trying to remove individually
        Object.values(fieldMeta).forEach(f => f.children.clear());

        Object.keys(fieldMeta)
            .forEach((fieldName) => {
                const splitPath = fieldName.split('.');
                if (splitPath.length == 1) {
                    // root level, no parent
                    return;
                }

                splitPath.pop();
                const parentPath = splitPath.join('.');
                fieldMeta[parentPath].children.add(fieldName);
            })
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

    validatePendingFields = (formState: FormState) => {
        const fields = formState.fields;

        // Filter down to only fields that need validation, get the field key
        const pendingFields = Object.entries(fields)
            .filter(([, field]) => field.pendingValidation)
            .map(([key]) => key);

        formState = this.validateByField(pendingFields, formState);

        return formState;
    };


    validateByField(fields: string[], formState: FormState) {
        const rawValidationResults = fields.reduce((agg, fieldName) => {
            const result = formState.fields[fieldName].validate();
            const depth = fieldName.split('.').length - 1;
            if (!agg[depth]) {
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

        // Process deepest nested elements first so that by the time it comes to check if all children are valid
        // then all children of the current element are already done validating.
        for (let i = rawValidationResults.length - 1; i >= 0; i--) {
            const resultsForDepth = rawValidationResults[i];
            if(!resultsForDepth) continue;

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
                    if (fieldMeta.children.size > 0) {
                        allValid = allValid && Array.from(fieldMeta.children.values()).every(c => agg[c].isValid)
                    }

                    agg[fieldName] = {
                        ...fieldMeta,
                        errors: allValid ? undefined : errors,
                        isValid: allValid,
                        pendingValidation: false
                    }

                    return agg;
                }, newFieldState);
        }

        return newFieldState
    }

    addToChangeQueue = (fieldName: string) => {
        this.changeQueue.push(fieldName);
    }

    getErrorsForField = (fieldName: string): FormErrorMap | undefined => {
        return this.props.formState.fields[fieldName] && this.props.formState.fields[fieldName].errors;
    }

    getIsTouchedForField = (fieldName: string): boolean => {
        return !!(this.props.formState.fields[fieldName] && this.props.formState.fields[fieldName].isTouched)
    }

    getHasSubmitted = () => {
        return this.props.formState.hasSubmitted;
    }

    onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newFormState = {
            ...this.props.formState,
            hasSubmitted: true,
        }

        if (this.props.formState.isValid && this.props.onSubmit) {
            this.props.onSubmit(this.props.formState.value);
        }

        this.props.onChange(newFormState);
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