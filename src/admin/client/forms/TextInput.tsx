import * as React from 'react';

import FormElement, { FormElementProps } from './FormElement';

interface TextInputProps extends FormElementProps<string> {
    required?: boolean
    minLength?: number,
}

@FormElement({
    validators: {
        required: (props: TextInputProps) => {
            if(!props.required) {
                return true;
            }

            return !!props.value;
        }
    }
})
export default class TextInput extends React.Component<TextInputProps, {}> {
    render() {
        const { 
            onChange = () => {},
            value = ''
        } = this.props;

        return (
            <input
                {...this.props}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    }
}