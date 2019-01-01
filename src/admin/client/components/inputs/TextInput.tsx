import * as React from 'react';

import formElement, { FormElementProps } from '../../forms/FormElement';
import ErrorMessages from '../../forms/errors/ErrorMessages';
import Message from '../../forms/errors/Message';

export interface TextInputProps extends FormElementProps<string> {
    minLength?: number,
}

class TextInput extends React.Component<TextInputProps, {}> {
    render() {
        const {
            onChange = () => { },
            value = '',
            minLength,
            formElement
        } = this.props;


        return (
            <>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {formElement && (
                    <ErrorMessages errors={formElement.errors}>
                        <ul>
                            <Message errorKey="required"><li>This value is required.</li></Message>
                            <Message errorKey="minLength"><li>This value must be at least {minLength} characters long.</li></Message>
                        </ul>
                    </ErrorMessages>
                )}
            </>
        )
    }
}

export default formElement<TextInputProps, string>({
    validators: {
        required: (props: TextInputProps) => {
            if (!props.required) {
                return true;
            }

            return props.value !== null && props.value !== undefined && props.value.trim() !== '';
        },
        minLength: ({ minLength, value }: TextInputProps) => {
            if (minLength === undefined || minLength <= 0) {
                return true;
            }

            if (value === undefined) {
                return false;
            }


            return value.length >= minLength;
        }
    }
})(TextInput);
