import * as React from 'react';

import { FieldMeta } from '../../../model';

import Form, { FormState, createFormState } from '../forms/Form';
import FormElement, { FormElementProps } from '../forms/FormElement';
import Select from '../components/inputs/Select';

import PrimitiveEditor from './PrimitiveEditor';
import ModelEditor from './ModelEditor';
import ArrayEditor from './ArrayEditor';
import TaggedUnionEditor from './TaggedUnionEditor';


export interface FieldEditorProps extends FormElementProps {
    fieldMeta: FieldMeta,
}

const FieldEditor: React.SFC<FieldEditorProps> = ({
    name,
    fieldMeta: f,
    ...otherProps
}) => {
    if (f.Component) {
        return <f.Component name={name} {...f.componentProps} {...otherProps} />;
    }

    if (f.arrayOf) {
        return <ArrayEditor arrayOf={f.arrayOf} name={name} {...otherProps} />
    }

    if (f.taggedUnion) {
        return <TaggedUnionEditor unionMeta={f.taggedUnion} name={name} {...otherProps} />
    }

    if (!!f.type.modelMeta) {
        return <ModelEditor modelMeta={f.type.modelMeta} name={name} {...otherProps} />;
    }


    if (f.possibleValues) {
        const selectOptions = Object
            .entries(f.possibleValues)
            .map(([valueKey, displayValue]) => ({ key: valueKey, displayValue }));

        return <Select name={name} options={selectOptions} {...otherProps} />;
    }
   
    return <PrimitiveEditor type={f.type} name={name} {...otherProps} />;
}

export default FieldEditor;