import * as React from 'react';
import { FormContext, FormContextValue } from './Form/FormContext';
import { ValidateCallback } from './Form/ValidateCallback';
import { FormErrorMap } from './errors/FormErrorMap';
import { ValueInterceptor, ValueInterceptorContext } from './ValueInterceptor';

export interface ValidatorMap {
    [key: string]: (props: any) => boolean
}

export interface FormElementProps<T = unknown> {
    name: string,
    value?: T,
    onChange?: (newValue: T) => void,
    required?: boolean,
    validators?: ValidatorMap,
    formElement?: {
        isTouched: boolean,
        
        errors?: FormErrorMap
        deregister: (path?: string) => void,
        setTouched: (isTouched: boolean) => void,
        formHasSubmitted: boolean,
    }
}

export interface FormElementOptions {
    defaultValue?: () => any
    validators?: FormElementProps['validators']
}

export default function formElement<T extends FormElementProps<V>, V>(options: FormElementOptions = {}): (ComponentToWrap: React.ComponentType<T> | React.SFC<T>) => React.SFC<T> {

    return function wrapFormElement(ComponentToWrap){
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

            setTouched = (isTouched: boolean) => {
                this.props.formContext && this.props.formContext.setTouched(this.path, isTouched);
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

            onChange = (newValue: V) => {
                this.props.formContext && this.props.formContext.addToChangeQueue(this.path);

                if (this.props.onChange) {
                    this.props.onChange(newValue);
                }
            }

            getValue = (fieldName: string): V | undefined => {
                if (this.props.value) {
                    return this.props.value;
                }
                else if (this.props.getValue) {
                    return this.props.getValue(fieldName)
                }
            }

            render() {
                const { 
                    name, 
                    value,
                    onChange, 
                    formElement, 
                    ...other
                } = (this.props as any); // FIXME: this is bad and I should feel bad

                const actualValue = this.getValue(name);
                let errors;
                let fieldIsTouched = false;
                let formHasSubmitted = false;
                if (this.props.formContext) {
                    errors = this.props.formContext.getErrors(this.path);
                    fieldIsTouched = this.props.formContext.getIsTouched(this.path);
                    formHasSubmitted = this.props.formContext.getHasSubmitted();
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
                            formElement={{
                                isTouched: fieldIsTouched,
                                deregister: this.deregister,
                                setTouched: this.setTouched,
                                formHasSubmitted,
                                errors,
                            }}
                            {...other}
                        />
                    </FormContext.Provider>
                )
            }
        }

        const retVal: React.SFC<T> =  (props: T) => (
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
        retVal.defaultProps = {
            formElement: {
                isTouched: false,
                errors: undefined,
                deregister: (p: string) => {}
            }
        } as Partial<T>

        return retVal;
    }
}