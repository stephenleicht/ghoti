import * as React from 'react';
import * as PropTypes from 'prop-types';
import { pick } from 'lodash'

import { ValidateCallback } from './Form/ValidateCallback';

import { FormContext, FormContextValue } from './Form/FormContext';
import { ValueInterceptorContext, ValueInterceptor } from './ValueInterceptor';

export interface FormElementProps {
    name: string,
    value?: any,
    required?: boolean,
    onChange?: (newValue: any) => void,
    formContext?: FormContextValue,
}

export interface FormElementOptions {
    defaultValue?: () => any
    validators?: {
        [key: string]: (props: any) => boolean
    }
}

export default function FormElement(options: FormElementOptions = {}) {

    return function wrapFormElement<T extends FormElementProps>(ComponentToWrap: React.ComponentClass<T>): (props: T) => JSX.Element {
        class WrappedComponent extends React.Component<T & ValueInterceptor, {}> {
            static defaultProps: any = {
                required: false,
            }

            path: string

            constructor(props: T & ValueInterceptor) {
                super(props);

                const { parentPath } = props.formContext as FormContextValue;
                this.path = `${parentPath}${parentPath && '.'}${this.props.name}`;
            }

            componentDidMount() {
                this.props.formContext && this.props.formContext.register(this.path, this.validate)
            }

            getMergedProps = () => {
                return {
                    ...(this.props as object),
                    value: this.getValue(this.props.name),
                }
            }

            validate: ValidateCallback = () => {
                if (!options.validators) {
                    return {}
                }

                const validationResults = Object
                    .entries(options.validators)
                    .map<[string, boolean]>(([key, validateFn]) => [key, validateFn(this.getMergedProps())])
                    .reduce<{ [errorKey: string]: boolean }>((agg, [key, validationResult]) => {
                        agg[key] = validationResult;
                        return agg;
                    }, {})

                return validationResults;
            }

            onChangeWrapper = (newValue: any) => {
                this.props.formContext && this.props.formContext.addToChangeQueue(this.path);

                if (this.props.onChange) {
                    this.props.onChange(newValue);
                }
            }

            getValue = (fieldName: string) => {
                if (this.props.value) {
                    return this.props.value;
                }
                else if (this.props.getValue) {
                    return this.props.getValue(fieldName)
                }
            }

            render() {
                const { name, value, onChange, required, parentPath, ...other } = (this.props as any);

                const actualValue = this.getValue(name);

                const context: FormContextValue = {
                    ...this.props.formContext as FormContextValue,
                    parentPath: this.path
                }

                return (
                    <FormContext.Provider value={context}>
                        <ComponentToWrap
                            name={name}
                            value={actualValue}
                            onChange={this.onChangeWrapper}
                            {...other}
                        />
                    </FormContext.Provider>
                )
            }
        }

        return (props: T) => (
            <FormContext.Consumer>
                {(formContextValue: FormContextValue) => (
                    <ValueInterceptorContext.Consumer>
                    {({ onChangeInterceptor, getValue }: ValueInterceptor) => (
                        <WrappedComponent
                            {...props as any}
                            formContext={formContextValue}
                            getValue={getValue}
                            onChange={(newValue: any) => onChangeInterceptor(props.name, newValue)}
                        />
                    )}
                </ValueInterceptorContext.Consumer>
                )}
            </FormContext.Consumer>
        )
    }
}