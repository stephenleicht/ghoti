import * as React from 'react';
import { FormContext, FormContextValue } from './Form/FormContext';
import { ValidateCallback } from './Form/ValidateCallback';
import { FormErrorMap } from './errors/FormErrorMap';
import { ValueInterceptor, ValueInterceptorContext } from './ValueInterceptor';



export interface ValidatorMap {
    [key: string]: (props: any) => boolean
}

export interface FormElementProps<T = any> {
    name: string,
    value?: T,
    errors?: FormErrorMap
    required?: boolean,
    onChange?: (newValue: T) => void,
    validators?: ValidatorMap,
    deregister?: (path?: string) => void,
}

export interface FormElementOptions {
    defaultValue?: () => any
    validators?: FormElementProps['validators']
}

export default function formElement(options: FormElementOptions = {}) {

    return function wrapFormElement<T extends FormElementProps>(ComponentToWrap: React.ComponentType<T> | React.SFC<T>): React.ComponentType<T> {
        class WrappedComponent extends React.Component<T & ValueInterceptor & { formContext?: FormContextValue }, {}> {
            static defaultProps: Partial<FormElementProps> = {
                required: false,
                validators: {}
            }

            path: string

            constructor(props: T & ValueInterceptor & { formContext: FormContextValue }) {
                super(props);

                const { parentPath } = props.formContext;
                this.path = `${parentPath}${parentPath && '.'}${this.props.name}`;
            }

            componentDidMount() {
                this.props.formContext && this.props.formContext.register(this.path, this.validate)
            }

            deregister = (childPath?: string) => {
                this.props.formContext && this.props.formContext.deregister(childPath ? `${this.path}.${childPath}` : this.path);
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
                    .map<[string, boolean]>(([key, validateFn]) => {
                        const result = validateFn(this.getMergedProps());
                        return [key, result];
                    })
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
                const { name, value, onChange, ...other } = (this.props as any); // FIXME: this is bad and I should feel bad

                const actualValue = this.getValue(name);
                let errors;
                if (this.props.formContext) {
                    errors = this.props.formContext.getErrors(this.path);
                }

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
                            errors={errors}
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