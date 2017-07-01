import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ValidateCallback } from './Form/ValidateCallback';



export interface FormElementProps<T> {
    value?: T,
    onChange?: (newValue: T) => void
}

export interface FormElementExternalProps {
    name: string,
}

interface FormElementOptions {
    validators?: {
        [key: string]: (props: any) => boolean
    }
}

export default function FormElement(options: FormElementOptions = {}) {

    return function<TOriginalProps extends {}>(WrappedComponent: React.ComponentClass<TOriginalProps & FormElementProps<any>>) {
        return class extends React.Component<TOriginalProps & FormElementExternalProps & FormElementProps<any>, {}> {
            context: {
                register: (path: string[], validateCallback: ValidateCallback) => void,
                parentPath?: Array<string>
            }

            static contextTypes = {
                register: PropTypes.func,
                parentPath: PropTypes.arrayOf(PropTypes.string)
            }

            static childContextTypes = {
                parentPath: PropTypes.string,
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

            validate = () => {
                if (!options.validators) {
                    return true;
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

            render(){
                const { name, ...other } = this.props;
                return <WrappedComponent {...other} />
            }
        } 
    }
}