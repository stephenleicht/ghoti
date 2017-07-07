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
    onSubmit: (value: any) => void,
}

interface ModelEditorState {
    formState: FormState,
}

export default class ModelEditor extends React.Component<ModelEditorProps, ModelEditorState> {
    constructor() {
        super();

        this.state = {
            formState: createFormState({})
        };
    }

    onFormChange = (newFormState: FormState) => {
        this.setState({formState: newFormState});
    }

    render() {
        const { model, onSubmit } = this.props;
        const { formState } = this.state;

        return (
            <div>
                <h1>Add {model.modelMeta.name}</h1>
                <Form formState={formState} onChange={this.onFormChange} onSubmit={onSubmit} >
                    {getEditorMarkupForModel(model)}
                    <button type="submit">Submit</button>
                </Form>
            </div>
        );
    }
}