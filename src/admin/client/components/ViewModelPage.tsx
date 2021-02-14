import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Form, FormState, createFormState } from '../forms';
import ModelEditor from '../editor/ModelEditor';

import { getModelByID, updateModel } from '../../../client';

export interface ViewModelPageParams {
    id: string
}

export interface ViewModelPageProps extends RouteComponentProps<ViewModelPageParams> {
    model: any,
}

export interface ViewModelState {
    formState?: FormState,
}


export default class ViewModelPage extends React.Component<ViewModelPageProps, ViewModelState> {
    constructor(props: ViewModelPageProps) {
        super(props);

        this.state = {
            formState: undefined,
        }
    }

    async componentDidMount() {
        const {
            model: {
                modelMeta
            },
            match: {
                params
            }
        } = this.props;

        const value = await getModelByID(modelMeta, params.id);

        this.setState({
            formState: createFormState({model: value}),
        });
    }

    onEditorSubmit = async (value: any) => {
        const { history, match, model } = this.props;
        await updateModel(model.modelMeta, match.params.id, value.model);

        history.push(`/models/${model.modelMeta.namePlural}`);
    }

    render() {
        const { model } = this.props;
        const { formState } = this.state;

        if (!formState) {
            return <h1>Loading...</h1>
        }

        return (
            <div>
                <h1>Edit Model</h1>
                <Form
                    formState={formState}
                    onSubmit={this.onEditorSubmit}
                    onChange={(newState: FormState) => this.setState({ formState: newState })}
                >
                    <ModelEditor
                        name="model"
                        modelMeta={model.modelMeta}
                    />
                    <button type="submit">Submit</button>
                </Form>

            </div>
        )
    }
}