import * as React from 'react';

import formElement, { FormElementProps } from '../../forms/FormElement';
import { SyntheticEvent } from 'react';

export interface NumberInputProps extends FormElementProps<number | string> {
}

class NumberInput extends React.Component<NumberInputProps, {}> {
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        const parsed = Number.parseInt(value);

        let retVal: string | number;
        if(parsed === undefined) {
            retVal = value;
        }
        else {
            retVal = parsed;
        }

        this.props.onChange && this.props.onChange(retVal);
    }
    
    render() {
        const { 
            value = ''
        } = this.props;

        return (
            <input
                type="number"
                value={value}
                onChange={this.onChange}
            />
        )
    }
}

export default formElement<NumberInputProps, number | string>({
    validators: {
        required: (props: NumberInputProps) => {
            if(!props.required) {
                return true;
            }

            return !!props.value;
        },
        isNumber: (props: NumberInputProps): boolean => {
            if(props.value === null || props.value === undefined) {
                return false;
            }

            return !!Number.parseInt(props.value.toString());
        }
    }
})(NumberInput);