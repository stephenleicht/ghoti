import * as React from 'react';
import { omit } from 'lodash';

import { TaggedUnionMeta } from '../../../model/TaggedUnion';
import { ModelMeta } from '../../../model/ModelMeta';

import { formElement, FormElementProps } from '../forms';
import Select, { SelectProps } from '../components/inputs/Select';

import ModelEditor from './ModelEditor';

export interface TaggedUnionValue {
    [field: string]: any
}

export interface TaggedUnionEditorProps extends FormElementProps<TaggedUnionValue> {
    unionMeta: TaggedUnionMeta
}

class TaggedUnionEditor extends React.Component<TaggedUnionEditorProps, object> {

    componentDidUpdate(prevProps: TaggedUnionEditorProps) {
        if(!this.props.formElement) { // No need to do any of this if it's not in a form for some reason. #sanitychecks
            return;
        }

        const prevTagValue = prevProps.value && prevProps.value[prevProps.unionMeta.tagField];
        const currTagValue = this.props.value && this.props.value[this.props.unionMeta.tagField];

        if (prevTagValue === currTagValue) {
            return;
        }

        const prevModelMeta = this.getModelMeta(prevProps);
        if(!prevModelMeta) {
            return; //No previous meta, nothing to remove.
        }

        const currModelMeta = this.getModelMeta(this.props);

        //Get list of fields that are in prevModelMeta, but not in currModelMeta
        const prevFields = Object.keys(prevModelMeta.fields);
        const removedFields = prevFields.filter((fieldName) => !currModelMeta.fields.hasOwnProperty(fieldName))

        for(const field of removedFields) {
            this.props.formElement.deregister(`map.${field}`);
        }
    }

    getModelMeta(props: TaggedUnionEditorProps = this.props): ModelMeta {
        const tagFieldValue = props.value && props.value[props.unionMeta.tagField];

        const unionMeta = props.unionMeta;
        const model = unionMeta.tagMap[tagFieldValue];
        const modelMeta: ModelMeta = model && model.modelMeta;

        return modelMeta;
    }

    onTagFieldChange = (newTagFieldValue: string | undefined) => {
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

        const modelMeta: ModelMeta = this.getModelMeta() || {};

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

export default formElement<TaggedUnionEditorProps, TaggedUnionValue>()(TaggedUnionEditor);