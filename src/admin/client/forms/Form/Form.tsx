import * as React from 'react';
import * as PropTypes from 'prop-types';
import { omit } from 'lodash';

import { FormState } from './FormState';
import { FormElementProps } from '../FormElement';
import { FormFieldMeta } from './FormFieldMeta';
import { ValidateCallback } from './ValidateCallback'
import { FormContext, FormContextValue } from './FormContext'
import { ValueInterceptorContext, ValueInterceptor } from '../ValueInterceptor';

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
        if(this.pendingRegistrations.length > 0 || this.pendingDeregistrations.length > 0) {
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

        if(shouldSetFormState) {
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
                    validate: registration.validateCallback
                }
            }
            else {
                currentFieldMeta = {
                    ...currentFieldMeta,
                    validate: registration.validateCallback
                }
            }

            return {
                ...agg,
                [pathKey]: currentFieldMeta
            }

        }, currentFields);

        newFieldMeta = this.pendingDeregistrations.reduce((agg, pathToDeregister) => {
            const fields = Object.keys(agg).filter(fieldKey => fieldKey.startsWith(pathToDeregister));
            return omit(agg, ...fields);
        }, newFieldMeta)

        this.pendingRegistrations = [];
        this.pendingDeregistrations = [];

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
        const newFieldState = fields
            .map<[string, { [validatorKey: string]: boolean }]>((field) => ([
                field,
                formState.fields[field].validate()
            ]))
            .reduce((agg, [key, validationResult]) => {
                let allValid = true;
                let errors: { [errorKey: string]: boolean } = {};
                Object.entries(validationResult)
                    .forEach(([key, isValid]) => {
                        allValid = allValid && isValid;

                        if (!isValid) {
                            errors[key] = true;
                        }
                    })

                agg[key] = {
                    ...agg[key],
                    pendingValidation: false,
                    isValid: allValid,
                    errors: allValid ? undefined : errors,
                }
                return agg;
            }, { ...formState.fields });

        const formIsValid = Object.values(newFieldState).every((field) => field.isValid);

        return {
            ...formState,
            pendingValidation: false,
            isValid: formIsValid,
            fields: newFieldState
        };
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