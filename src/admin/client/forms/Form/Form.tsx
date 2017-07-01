import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormState } from './FormState';
import { FormElementProps, FormElementExternalProps } from '../FormElement';
import { ValidateCallback } from './ValidateCallback';
import { FormFieldMeta } from './FormFieldMeta';

import * as styles from './Form.css';

interface FormProps {
    children: React.ReactNode,
    formState: FormState,
    onChange: (newState: FormState) => void
}

export interface FormContext {
    register: (fieldName: string, validateCallback: ValidateCallback) => void,
}

export default class Form extends React.Component<FormProps, {}> {
    static childContextTypes = {
        register: PropTypes.func,
    }

    pendingRegistrations: Array<{ fieldName: string, validateCallback: ValidateCallback }> = []

    getChildContext(): FormContext {
        return {
            register: this.registerChild
        }
    }

    registerChild = (fieldName: string, validateCallback: ValidateCallback) => {
        this.pendingRegistrations.push({
            fieldName,
            validateCallback,
        });
    }

    componentDidMount() {
        const { formState } = this.props;

        const currentFields = formState.fields;
        const newFieldMeta = this.pendingRegistrations.reduce((agg, registration) => {
            let currentFieldMeta = agg[registration.fieldName];
            if (!agg[registration.fieldName]) {
                currentFieldMeta = {
                    isPristine: true,
                    isValid: true,
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
                [registration.fieldName]: currentFieldMeta
            }

        }, currentFields);

        this.props.onChange({
            ...formState,
            fields: newFieldMeta
        });
    }

    onChildChange = (childName: string, newValue: any) => {
        if (newValue.target && newValue.target instanceof HTMLElement) {
            newValue = newValue.target.value;
        }

        this.props.onChange({
            ...this.props.formState,
            value: {
                ...this.props.formState.value,
                [childName]: newValue
            }
        });
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
                    const namedChild = child as React.ReactElement<FormElementProps<any> & FormElementExternalProps>;

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
        const newFieldState = Object
            .entries(this.props.formState.fields)
            .map(([key, fieldMeta]) => [key, fieldMeta.validate()])
            .reduce((agg, [key, validationResult]: [string, boolean]) => {
                agg[key] = {
                    ...agg[key],
                    isValid: validationResult
                }
                return agg;
            }, {...this.props.formState.fields});

            this.props.onChange({
                ...this.props.formState,
                fields: newFieldState
            });
    }

    render() {
        return (
            <div className={styles.test}>
                {this.prepareChildren(this.props.children)}
            </div>
        );
    }
}