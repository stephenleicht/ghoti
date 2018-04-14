import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormState } from './FormState';
import { FormElementProps } from '../FormElement';
import { FormFieldMeta } from './FormFieldMeta';
import { ValidateCallback } from './ValidateCallback'
import { FormContext, FormContextValue } from './FormContext'
import { ValueInterceptorContext, ValueInterceptor } from '../ValueInterceptor';

import * as styles from './Form.css';

export interface FormProps {
    children: React.ReactNode,
    formState: FormState,
    onChange: (newState: FormState) => void,
    onSubmit?: (value: Object) => void,
}

export default class Form extends React.Component<FormProps, {}> {
    pendingRegistrations: Array<{ path: string, validateCallback: ValidateCallback }> = []
    changeQueue: string[] = []
    formChildContext: FormContextValue
    valueInterceptorChildContext: ValueInterceptor


    constructor(props: FormProps) {
        super(props);

        this.formChildContext = {
            register: this.registerChild,
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

    componentDidMount() {
        const { formState } = this.props;

        const newFormState = this.processRegistrations();
        this.pendingRegistrations = [];

        this.props.onChange(newFormState);
    }

    componentDidUpdate(prevProps: FormProps) {
        if (!prevProps.formState.pendingValidation && this.props.formState.pendingValidation) {
            const fields = this.props.formState.fields;

            const pendingFields = Object.entries(fields)
                .filter(([, field]) => field.pendingValidation)
                .map(([key]) => key);

            this.validateByField(pendingFields);
        }
    }

    processRegistrations(): FormState {
        const { formState } = this.props;

        const currentFields = formState.fields;
        const newFieldMeta = this.pendingRegistrations.reduce((agg, registration) => {
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
        this.validateByField(Object.keys(this.props.formState.fields));
    }

    validateByField(fields: string[]) {
        const { formState } = this.props;

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
            }, { ...this.props.formState.fields });

        const formIsValid = Object.values(newFieldState).every((field) => field.isValid);

        this.props.onChange({
            ...this.props.formState,
            pendingValidation: false,
            isValid: formIsValid,
            fields: newFieldState
        });
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
                    <form className={styles.test} onSubmit={this.onFormSubmit}>
                        {this.props.children}
                    </form>
                </ValueInterceptorContext.Provider>
            </FormContext.Provider>
        );
    }
}