import * as React from 'react';
import modelContstants from '../../../model/constants';
import { ModelMeta } from '../../../model';

import Form, { FormState, createFormState } from '../forms/Form';

import EmbededModel from './EmbededModel';

import { defaultComponentsByType } from './defaultComponentsByType';


function getEditorMarkupForModel(model: any) : React.ReactElement<any> | Array<React.ReactElement<any>>{
    const modelMeta: ModelMeta = model.modelMeta;

    const fields = Object.entries(modelMeta.fields)
        .filter(([key, f]) => f.editable)
        .map(([key, f]) => {
            if (!!f.type.modelMeta) {
                return (
                    <EmbededModel key={key} name={key}>
                        <label>{key}</label>
                        {getEditorMarkupForModel(f.type)}
                    </EmbededModel>
                )
            }

            const Component = defaultComponentsByType.get(f.type);

            if (!Component) {
                return <div>No editor for type {f.type.toString()}</div>
            }

            return (
                <div>
                    <label key={`${key}-label`}>{key}</label>
                    <Component key={`${key}-component`} name={key} />
                </div>
            )

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