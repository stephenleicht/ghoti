import * as React from 'react';
import * as PropTypes from 'prop-types';
import { pick } from 'lodash'

import { ValidateCallback } from './Form/ValidateCallback';

import { FormContext, FormContextValue } from './Form/FormContext';

export interface FormElementProps {
    name: string,
    value?: any,
    required?: boolean,
    onChange?: (newValue: any) => void,
    [key: string]: any,
}

export interface FormElementOptions {
    defaultValue?: () => any
    validators?: {
        [key: string]: (props: any) => boolean
    }
}

export interface FormElementContextValue {
    parentPath: string[],
    onChangeNotifier?: (name: string, newValue: any) => void,
}

const FormElementContext = React.createContext<FormElementContextValue>();

export default function FormElement(options: FormElementOptions = {}) {

    return function wrapFormElement<T extends FormElementProps>(ComponentToWrap: React.ComponentClass<T>): (props: T) => JSX.Element {
        class WrappedComponent extends React.Component<T & FormContextValue & FormElementContextValue> {
            static defaultProps: any = {
                required: false,
                onChange: () => { },
            }

            wrappedComponent: any
            childContextValue: FormElementContextValue

            componentDidMount() {

                let onChangeNotifier = undefined;

                if (this.wrappedComponent && this.wrappedComponent.onChildElementChange) {
                    onChangeNotifier = this.onChildElementChange
                }

                const register = this.props.register(this.path, this.validate)
            }

            get path() {
                const { parentPath = [] } = this.props;
                return [...parentPath, this.props.name]
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
                this.props.addToChangeQueue(this.path.join('.'));

                if (this.props.onChangeNotifier) {
                    this.props.onChangeNotifier(this.props.name, newValue);
                }

                if (this.props.onChange) {
                    this.props.onChange(newValue);
                }
            }

            onChildElementChange = (name: string, newValue: any) => {
                if (this.wrappedComponent && this.wrappedComponent.onChildElementChange) {
                    this.wrappedComponent.onChildElementChange(name, newValue);
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
                const { name, value, onChange, required, parentPath, onChangeNotifier, ...other } = (this.props as any);

                let injectedOnChange;
                if (onChange) {
                    injectedOnChange = this.onChangeWrapper;
                }

                const actualValue = this.getValue(name);

                const childContextValue = {
                    parentPath: this.path,
                    onChangeNotifier,
                }

                // HACK: Typescript got angry trying to merge props into the wrapped component
                // It doesn't seem to be able to understand that the wrapping FormElement
                // injects props into the child, or I am not fully understanding the type system (this is more likely)
                // But I've spent way too much time tring to get typescript to understand
                // hacky any annotation it is!
                const childProps: any = {
                    name,
                    value: actualValue,
                    onChange: injectedOnChange,
                    ref: (c: any) => { this.wrappedComponent = c; },
                    ...other,
                }

                return (
                    <FormElementContext.Provider value={childContextValue}>
                        <ComponentToWrap
                            {...childProps}
                        />
                    </FormElementContext.Provider>
                )
            }
        }

        return (props: T) => (
            <FormContext.Consumer>
                {(formContextValue: FormContextValue) => (
                    <FormElementContext.Consumer>
                        {(elementContextValue: FormElementContextValue) => (
                            <WrappedComponent {...props} {...formContextValue} {...elementContextValue}/>
                        )}
                    </FormElementContext.Consumer>
                )}
            </FormContext.Consumer>
        )
    }
}