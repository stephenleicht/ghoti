import * as React from 'react';

import FormElement, { FormElementProps } from './FormElement';
import { SyntheticEvent } from 'react';

export interface NumberInputProps extends FormElementProps<string> {
    required?: boolean
    onChange: (value: String) => void,
}

@FormElement({
    validators: {
        required: (props: TextInputProps) => {
            if(!props.required) {
                return true;
            }

            return !!props.value;
        },
        isNumber: (props: TextInputProps): boolean => {
            if(!props.value) {
                return false;
            }

            return !!Number.parseInt(props.value);
        }
    }
})
export default class NumberInput extends React.Component<NumberInputProps, {}> {
    static defaultProps = {
        onChange: () => {},
    }

    onChange = (e) => {
        const value = e.target.value;

        const parsed = Number.parseInt(value);

        this.props.onChange(!!parsed ? parsed : value);
    }
    
    render() {
        const { 
            onChange
            value = ''
        } = this.props;

        return (
            <input
                {...this.props}
                type="number"
                value={value}
                onChange={this.onChange}
            />
        )
    }
}