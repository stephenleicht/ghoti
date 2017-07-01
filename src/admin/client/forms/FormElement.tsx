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
            static contextTypes = {
                register: PropTypes.func,
            }
            
            componentDidMount() {
                const register = this.context.register(this.props.name, this.validate)
            }

            validate = () => {
                if (!options.validators) {
                    return true;
                }

                const validationResults = Object.entries(options.validators)
                .map(([key, validateFn]) => validateFn(this.props))
                .reduce((agg, result) => agg && result, true)

                return validationResults;
            }

            render(){
                const { name, ...other } = this.props;
                return <WrappedComponent {...other} />
            }
        } 
    }
}