import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormState } from './FormState';
import { FormElementProps } from '../FormElement';
import { ValidateCallback } from './ValidateCallback';
import { FormFieldMeta } from './FormFieldMeta';

import * as styles from './Form.css';

interface FormProps {
    children: React.ReactNode,
    formState: FormState,
    onChange: (newState: FormState) => void,
    onSubmit?: (value: Object) => void,
}

export interface FormContext {
    register: (path: string[], validateCallback: ValidateCallback) => void,
    addToChangeQueue: (fieldName: string) => void,
    onChangeNotifier: (name: string, newValue: any) => void,
    getValue: (fieldName: string) => any,
}

export default class Form extends React.Component<FormProps, {}> {
    static childContextTypes = {
        register: PropTypes.func,
        addToChangeQueue: PropTypes.func,
        onChangeNotifier: PropTypes.func,
        getValue: PropTypes.func,
    }
    pendingRegistrations: Array<{ path: string[], validateCallback: ValidateCallback }> = []
    changeQueue: string[] = []

    getChildContext(): FormContext {
        return {
            register: this.registerChild,
            addToChangeQueue: this.addToChangeQueue,
            onChangeNotifier: this.onChildChange,
            getValue: this.getChildValue,
        }
    }

    registerChild = (path: string[], validateCallback: ValidateCallback) => {
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
            const pathKey = registration.path.join('.');
            let currentFieldMeta = agg[pathKey];
            if (!agg[pathKey]) {
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
        }, {...this.props.formState.fields})

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
        if(this.props.formState && this.props.formState.value) {
            return this.props.formState.value[fieldName];
        }
    }

    prepareChildren(children: React.ReactNode) {
        return React.Children.toArray(children)
            .map((child: React.ReactChild) => {
                if (!React.isValidElement<any>(child)) {
                    return child;
                }

                let propsToAdd: Partial<FormElementProps<any>> & { children?: any } = {};
                if (child.props.children) {
                    propsToAdd = {
                        ...propsToAdd,
                        children: this.prepareChildren(child.props.children)
                    };
                }

                if (child.props.hasOwnProperty('name')) {
                    const namedChild = child as React.ReactElement<FormElementProps<any>>;

                    propsToAdd = {
                        ...propsToAdd,
                        value: this.props.formState.value[namedChild.props.name],
                        onChange: (value) => this.onChildChange(namedChild.props.name, value)
                    }
                }

                return React.cloneElement(child, propsToAdd);
            })
    }

    validate() {
        this.validateByField(Object.keys(this.props.formState.fields));
    }

    validateByField(fields: string[]) {
        const { formState }  = this.props;

        const newFieldState = fields
            .map((field) => ([
                field,
                formState.fields[field].validate()
            ]))
            .reduce((agg, [key, validationResult]: [string, {[key: string]: boolean}]) => {
                let allValid = true;
                let errors: {[errorKey: string]: boolean} = {};
                Object.entries(validationResult)
                .forEach(([key, isValid]) => {
                    allValid = allValid && isValid;
                    
                    if(!isValid) {
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
            }, {...this.props.formState.fields});

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
            <form className={styles.test} onSubmit={this.onFormSubmit}>
                {this.props.children}
            </form>
        );
    }
}