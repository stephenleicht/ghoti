import * as React from 'react';

import formElement, { FormElementProps } from '../../forms/FormElement';
import { lineBreak } from 'acorn';

export interface TextInputProps extends FormElementProps {
    minLength?: number,
}

class TextInput extends React.Component<TextInputProps, {}> {
    render() {
        const {
            onChange = () => { },
            value = '',
            errors,
        } = this.props;


        return (
            <>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {errors && (
                    <ul>
                        {Object.keys(errors).map(e => <li key={e}>{e}</li>)}
                    </ul>
                )}
            </>
        )
    }
}

export default formElement({
    validators: {
        required: (props: TextInputProps) => {
            if (!props.required) {
                return true;
            }

            return props.value !== null && props.value !== undefined && props.value.trim() !== '';
        },
        minLength: ({minLength, value}: TextInputProps) => {
            if(minLength === undefined || minLength <= 0) {
                return true;
            }

            if(value === undefined) {
                return false;
            }


            return value.length >= minLength;
        }
    }
})(TextInput);