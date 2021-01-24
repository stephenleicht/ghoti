import * as React from 'react';

import { FormElementProps } from '../forms/formElement';

import TextInput from '../components/inputs/TextInput';
import NumberInput from '../components/inputs/NumberInput';
import Checkbox from '../components/inputs/Checkbox';

export interface PrimitiveEditorProps extends FormElementProps<any> {
    type: any,
}

const componentsByType = new Map<any, any>([
    [String, TextInput],
    [Number, NumberInput],
    [Boolean, Checkbox],
]);

const PrimitiveEditor: React.SFC<PrimitiveEditorProps> = ({ type, ...otherProps}) => {
    const Component = componentsByType.get(type);

    if (!Component) {
        return <div>No editor for type {type.toString()}</div>
    }

    return <Component {...otherProps} />;
}

export default PrimitiveEditor;