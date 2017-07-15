import * as React from 'react';
import modelContstants from '../../../model/constants';
import { ModelMeta } from '../../../model/PersistedField';

import Form, { FormState, createFormState } from '../forms/Form';

import { defaultComponentsByType } from './defaultComponentsByType';


function getEditorMarkupForModel(model: any) {
    const modelMeta: ModelMeta = model.modelMeta;

    const fields = Object.entries(modelMeta.fields)
        .filter(([key, f]) => f.editable)
        .map(([key, f]) => {
            const Component = defaultComponentsByType.get(f.type);

            if (!Component) {
                return <div>No editor for type</div>
            }

            return (
                <div key={key}>
                    <label>{key}</label>
                    <Component name={key}/>
                </div>
            )
        })

    return (
        <div>
            {fields}
        </div>
    );
}

interface ModelEditorProps {
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
                    {getEditorMarkupForModel(model)}
                    <button type="submit">Submit</button>
                </Form>
            </div>
        );
    }
}