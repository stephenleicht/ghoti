import * as React from 'react';
import modelContstants from '../../../model/constants';
import { ModelMeta } from '../../../model/PersistedField';

import Form, { FormState, createFormState } from '../forms/Form';

import { defaultComponentsByType } from './defaultComponentsByType';


function getEditorMarkupForModel(model: any) {
    const modelMeta: ModelMeta = Reflect.getMetadata(modelContstants.MODEL_META_KEY, model);

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
                    <Component name={key} required/>
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

    onFormSubmit = (value: any) => {
        console.log('form value', value);
    }

    render() {
        const { model } = this.props;
        const { formState } = this.state;

        return (
            <div>
                <h3>Editor header, save buttons etc can be here.</h3>
                <Form formState={formState} onChange={this.onFormChange} onSubmit={this.onFormSubmit} >
                    {getEditorMarkupForModel(model)}
                    <button type="submit">Submit</button>
                </Form>
            </div>
        );
    }
}