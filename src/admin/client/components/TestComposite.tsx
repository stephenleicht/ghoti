import * as React from 'react';
import formElement, { FormElementProps } from '../forms/FormElement';

import TextInput from './inputs/TextInput';


type CompositeValue = {
    valueOne: string,
    valueTwo: string,
}

export interface CompositeInputProps extends FormElementProps<CompositeValue> {
    test?: string
}

class CompositeInput extends React.Component<CompositeInputProps, {}> {

    onChange = (field: keyof CompositeValue, newFieldValue: string) => {
        const currentValue = this.props.value || {} as CompositeValue;
        const newValue = {
            ...currentValue,
            [field]: newFieldValue
        };

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    }

    render() {
        const { value = {} as CompositeValue } = this.props;

        return (
            <div>
                <h4>Composite</h4>
                <label>
                    <TextInput name="valueOne" value={value.valueOne} onChange={v => this.onChange('valueOne', v)} required />
                    <TextInput name="valueTwo" value={value.valueTwo} onChange={v => this.onChange('valueTwo', v)} />
                </label>
            </div>
        )
    }
} 

export default formElement<CompositeInputProps, CompositeValue>()(CompositeInput)