import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ValidateCallback } from './Form/ValidateCallback';

import { FormContext } from './Form/Form';

export interface FormElementProps<T> {
    name: string,
    value?: T,
    onChange?: (newValue: T) => void
}

interface FormElementOptions {
    validators?: {
        [key: string]: (props: any) => boolean
    }
}

export default function FormElement(options: FormElementOptions = {}) {

    return function wrapFormElement<T extends FormElementProps<any>>(ComponentToWrap: React.ComponentClass<T>) {
        return class WrappedComponent extends React.Component<T, {}> {
            context: FormContext & {
                parentPath: string[],
            }

            static contextTypes = {
                register: PropTypes.func,
                addToChangeQueue: PropTypes.func,
                parentPath: PropTypes.arrayOf(PropTypes.string)
            }

            static childContextTypes = {
                parentPath: PropTypes.arrayOf(PropTypes.string),
            }

            getChildContext() {
                return {
                    parentPath: this.path
                }
            }
            
            componentDidMount() {
                const register = this.context.register(this.path, this.validate)
            }

            get path() {
                const { parentPath } = this.context;
                return [...(parentPath ? parentPath : []), this.props.name]
            }

            validate: ValidateCallback = () => {
                if (!options.validators) {
                    return {}
                }

                const validationResults = Object
                                            .entries(options.validators)
                                            .map<[string, boolean]>(([key, validateFn]) => [key, validateFn(this.props)])
                                            .reduce<{[errorKey: string]: boolean}>((agg, [key, validationResult]) => {
                                                agg[key] = validationResult;
                                                return agg;
                                            }, {})

                return validationResults;
            }

            onChangeWrapper = (newValue: any) => {
                this.context.addToChangeQueue(this.path.join('.'));
                if (this.props.onChange) {
                    this.props.onChange(newValue);
                }
            }

            render(){
                const { name, onChange, ...other } = this.props;
                let injectedOnChange;
                if (onChange) {
                    injectedOnChange = this.onChangeWrapper;
                }

                return <ComponentToWrap {...other} onChange={injectedOnChange} />
            }
        } 
    }
}