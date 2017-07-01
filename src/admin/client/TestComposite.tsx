import * as React from 'react';
import FormElement, { FormElementProps, FormElementExternalProps } from './forms/FormElement';

import TextInput from './forms/TextInput';


type CompositeValue = {
    valueOne: string,
    valueTwo: string,
}

@FormElement()
export default class CompositeInput extends React.Component<FormElementProps<CompositeValue> & FormElementExternalProps, {}> {
    onChange = (field: keyof CompositeValue, newValue: string) => {
        const currentValue = this.props.value || {} as CompositeValue
        this.props.onChange({
            ...currentValue,
            [field]: newValue
        })
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