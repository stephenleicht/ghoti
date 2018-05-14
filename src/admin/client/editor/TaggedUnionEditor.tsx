import * as React from 'react';
import { omit } from 'lodash';

import { TaggedUnionMeta } from '../../../model/Field';

import { FormElement, FormElementProps } from '../forms';
import Select, { SelectProps } from '../components/inputs/Select';

import ModelEditor from './ModelEditor';

export interface TaggedUnionEditorProps extends FormElementProps {
    unionMeta: TaggedUnionMeta
}

class TaggedUnionEditor extends React.Component<TaggedUnionEditorProps, object> {
    onTagFieldChange = (newTagFieldValue: string) => {
        const { unionMeta, value, onChange } = this.props;

        const newValue = {
            ...value,
            [unionMeta.tagField]: newTagFieldValue
        }

        onChange && onChange(newValue);
    }

    onMapChange = (newMapValue: { [key: string]: any }) => {
        const { value, onChange } = this.props;

        const newValue = {
            ...value,
            ...newMapValue
        }

        onChange && onChange(newValue);
    }

    render() {
        const { unionMeta, value = {} } = this.props;

        const tagKeys = Object.keys(unionMeta.tagMap);
        const tagOptions: SelectProps['options'] = tagKeys.map(val => ({ key: val, displayValue: val }))

        const model = unionMeta.tagMap[value[unionMeta.tagField]];
        const modelMeta = model && model.modelMeta || {};

        const modifiedModelMeta = {
            ...modelMeta,
            fields: {
                ...omit(modelMeta.fields, unionMeta.tagField)
            }
        }
        const modifiedValue = omit(value, unionMeta.tagField);

        return (
            <div>
                <label>{unionMeta.tagField}</label>
                <Select name="tagField" options={tagOptions} value={value[unionMeta.tagField]} onChange={this.onTagFieldChange} />
                <div>
                    {Object.keys(modifiedModelMeta.fields).length > 0 &&
                        <ModelEditor
                            name="map"
                            modelMeta={modifiedModelMeta}
                            value={modifiedValue}
                            onChange={this.onMapChange}
                        />}
                </div>
            </div>
        )
    }
}

export default FormElement()(TaggedUnionEditor);