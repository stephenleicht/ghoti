import * as React from 'react';

import formElement, { FormElementProps } from '../../forms/FormElement';

export interface TextInputProps extends FormElementProps {
    minLength?: number,
}

class TextInput extends React.Component<TextInputProps, {}> {
    render() {
        const { 
            onChange = () => {},
            value = ''
        } = this.props;

        return (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    }
}

export default formElement({
    validators: {
        required: (props: TextInputProps) => {
            if(!props.required) {
                return true;
            }

            return props.value !== null && props.value !== undefined && props.value.trim() !== '';
        }
    }
})(TextInput);