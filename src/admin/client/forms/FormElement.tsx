import * as React from 'react';
import { FormContext, FormContextValue } from './Form/FormContext';
import { ValidateCallback } from './Form/ValidateCallback';
import { ValueInterceptor, ValueInterceptorContext } from './ValueInterceptor';



export interface ValidatorMap {
    [key: string]: (props: any) => boolean
}

export interface FormElementProps<T = any> {
    name: string,
    value?: T,
    required?: boolean,
    onChange?: (newValue: T) => void,
    validators?: ValidatorMap,
    deregister?: (path?: string) => void,
}

export interface FormElementOptions {
    defaultValue?: () => any
    validators?: FormElementProps['validators']
}

export default function FormElement(options: FormElementOptions = {}) {

    return function wrapFormElement<T extends FormElementProps>(ComponentToWrap: React.ComponentType<T>): React.ComponentType<T> {
        class WrappedComponent extends React.Component<T & ValueInterceptor & { formContext?: FormContextValue}, {}> {
            static defaultProps: Partial<FormElementProps> = {
                required: false,
                validators: {}
            }

            path: string

            constructor(props: T & ValueInterceptor & { formContext: FormContextValue}) {
                super(props);

                const { parentPath } = props.formContext;
                this.path = `${parentPath}${parentPath && '.'}${this.props.name}`;
            }

            componentDidMount() {
                this.props.formContext && this.props.formContext.register(this.path, this.validate)
            }

            deregister = (path?: string) => {
                this.props.formContext && this.props.formContext.deregister(path ? `${this.path}.${path}` : this.path);
            }

            getMergedProps = () => {
                return {
                    ...(this.props as object),
                    value: this.getValue(this.props.name),
                }
            }

            validate: ValidateCallback = () => {
                if (!options.validators && !this.props.validators) {
                    return {}
                }

                const allValidators: ValidatorMap = {
                    ...options.validators,
                    ...this.props.validators as object,
                }

                const validationResults = Object
                    .entries(allValidators)
                    .map<[string, boolean]>(([key, validateFn]) => [key, validateFn(this.getMergedProps())])
                    .reduce((agg, [key, validationResult]) => {
                        agg[key] = validationResult;
                        return agg;
                    }, {} as { [errorKey: string]: boolean })

                return validationResults;
            }

            onChange = (newValue: any) => {
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
                            onChange={this.onChange}
                            deregister={this.deregister}
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
                            formContext={formContextValue}
                            getValue={getValue}
                            onChange={(newValue: any) => onChangeInterceptor(props.name, newValue)}
                            {...props as any}
                        />
                    )}
                </ValueInterceptorContext.Consumer>
                )}
            </FormContext.Consumer>
        )
    }
}