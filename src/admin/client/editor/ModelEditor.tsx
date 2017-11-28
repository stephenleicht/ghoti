import * as React from 'react';
import modelContstants from '../../../model/constants';
import { ModelMeta } from '../../../model';

import Form, { FormState, createFormState } from '../forms/Form';

import EmbededModel from './EmbededModel';

import { defaultComponentsByType } from './defaultComponentsByType';
import Select from '../forms/Select';
import Group from '../forms/Group';


function getEditorMarkupForModel(model: any): React.ReactElement<any> | Array<React.ReactElement<any>> {
    const modelMeta: ModelMeta = model.modelMeta;

    const fields = Object.entries(modelMeta.fields)
        .filter(([key, f]) => f.editable)
        .map(([key, f]) => {
            if (f.Component) {
                return (
                    <div>
                        <label key={`${key}-label`}>{key}</label>
                        <f.Component key={`${key}-component`} name={key} {...f.componentProps} />
                    </div>
                );
            }

            if (!!f.type.modelMeta) {
                return (
                    <Group key={key} name={key}>
                        <label>{key}</label>
                        {getEditorMarkupForModel(f.type)}
                    </Group>
                )
            }

            if (f.possibleValues) {
                const selectOptions = Object
                    .entries(f.possibleValues)
                    .map(([valueKey, displayValue]) => ({ key: valueKey, displayValue }));

                return (
                    <div>
                        <label key={`${key}-label`}>{key}</label>
                        <Select key={`${key}-component`} name={key} options={selectOptions} />
                    </div>
                )
            }
            else {
                const Component = defaultComponentsByType.get(f.type);

                if (!Component) {
                    return <div>No editor for type {f.type.toString()}</div>
                }

                return (
                    <div>
                        <label key={`${key}-label`}>{key}</label>
                        <Component key={`${key}-component`} name={key} {...f.componentProps} />
                    </div>
                )
            }

        })

    return fields;
}

export interface ModelEditorProps {
    model: any,
    formState: FormState,
    onChange: (newValue: FormState) => void,
    onSubmit: (value: any) => void,
}

export default class ModelEditor extends React.Component<ModelEditorProps, {}> {
    render() {
        const { model, formState, onSubmit, onChange } = this.props;

        return (
            <div>
                <Form formState={formState} onChange={onChange} onSubmit={onSubmit} >
                    <div>
                        {getEditorMarkupForModel(model)}
                    </div>

                    <button type="submit">Submit</button>
                </Form>
            </div>
        );
    }
}