import * as React from 'react';

import { FieldMeta } from '../../../model';

import Form, { FormState, createFormState } from '../forms/Form';
import formElement, { FormElementProps } from '../forms/formElement';
import Select, { SelectProps } from '../components/inputs/Select';

import PrimitiveEditor from './PrimitiveEditor';
import ModelEditor from './ModelEditor';
import ArrayEditor from './ArrayEditor';
import TaggedUnionEditor from './TaggedUnionEditor';


export interface FieldEditorProps extends FormElementProps<any> {
    fieldMeta: FieldMeta,
}

const FieldEditor: React.FunctionComponent<FieldEditorProps> = ({
    name,
    fieldMeta: f,
    ...otherProps
}) => {
    if (f.Component) {
        return <f.Component name={name} {...f.componentProps} {...otherProps} />;
    }

    const {type, required} = f;

    if (type._ghotiType === 'arrayOf') {
        return <ArrayEditor arrayOf={type.arrayOf} name={name} required={required} {...otherProps} />
    }

    if (type._ghotiType === 'taggedUnion') {
        return <TaggedUnionEditor unionMeta={type} name={name} required={required} {...otherProps} />
    }

    if (type._ghotiType === 'ref') {
        return <ModelEditor modelMeta={type.modelMeta} name={name} required={required} {...otherProps} />;
    }

    if(type._ghotiType === 'enumOf') {
        const selectOptions: SelectProps['options'] = Object
            .entries(type.enumOf)
            .map(([valueKey, displayValue]) => ({ key: valueKey, displayValue }));

        return <Select name={name} options={selectOptions} required={required} {...otherProps}/>
    }

    if (f.possibleValues) {
        const selectOptions = Object
            .entries(f.possibleValues)
            .map(([valueKey, displayValue]) => ({ key: valueKey, displayValue }));

        return <Select name={name} options={selectOptions} required={required} {...otherProps} />;
    }
   
    return <PrimitiveEditor type={type.type} name={name} {...otherProps} />;
}

export default FieldEditor;