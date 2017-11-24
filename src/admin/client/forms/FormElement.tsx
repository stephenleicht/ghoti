import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ValidateCallback } from './Form/ValidateCallback';

import { FormContext } from './Form/Form';

export interface FormElementProps {
    name: string,
    value?: any,
    required?: boolean,
    onChange?: (newValue: any) => void,
    [otherPropKey: string]: any,
}

export interface FormElementOptions {
    defaultValue?: () => any
    validators?: {
        [key: string]: (props: any) => boolean
    }
}

export default function FormElement(options: FormElementOptions = {}) {

    return function wrapFormElement<T extends { [key: string]: any }>(ComponentToWrap: React.ComponentClass<T & FormElementProps>): React.ComponentClass<T & FormElementProps> {
        return class WrappedComponent extends React.Component<T & FormElementProps, {}> {
            static defaultProps: any = {
                required: false,
                onChange: () => { },
            }

            static contextTypes = {
                register: PropTypes.func,
                addToChangeQueue: PropTypes.func,
                parentPath: PropTypes.arrayOf(PropTypes.string),
                onChangeNotifier: PropTypes.func,
                getValue: PropTypes.func,
            }

            static childContextTypes = {
                parentPath: PropTypes.arrayOf(PropTypes.string),
                onChangeNotifier: PropTypes.func,
                getValue: PropTypes.func,
            }

            context: FormContext & {
                parentPath: string[],
            }

            wrappedComponent: any

            getChildContext() {
                let onChangeNotifier = undefined;

                if (this.wrappedComponent && this.wrappedComponent.onChildElementChange) {
                    onChangeNotifier = this.onChildElementChange
                }

                return {
                    parentPath: this.path,
                    getValue: this.getValue,
                    onChangeNotifier,
                }
            }

            componentDidMount() {
                const register = this.context.register(this.path, this.validate)

                // setTimeout(() => {
                //     if(!this.props.value && options.defaultValue) {
                //         this.props.onChange && this.onChangeWrapper(options.defaultValue());
                //     }
                // }, 0);
            }

            get path() {
                const { parentPath } = this.context;
                return [...(parentPath ? parentPath : []), this.props.name]
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
                this.context.addToChangeQueue(this.path.join('.'));

                if (this.context.onChangeNotifier) {
                    this.context.onChangeNotifier(this.props.name, newValue);
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
                else if (this.context.getValue) {
                    return this.context.getValue(fieldName)
                }
            }

            render() {
                const { name, value, onChange, required, ...other } = (this.props as FormElementProps);

                let injectedOnChange;
                if (onChange) {
                    injectedOnChange = this.onChangeWrapper;
                }

                const actualValue = this.getValue(name);

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
                    <ComponentToWrap
                        {...childProps}
                    />
                )
            }
        }
    }
}