import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Form, FormState, createFormState } from '../forms';
import ModelEditor from '../editor/ModelEditor';

import { createModel } from '../api';

export interface CreateModelPageProps extends RouteComponentProps<any> {
    model: any,
}

interface CreateModelState {
    formState: FormState,
}


class CreateModelPage extends React.Component<CreateModelPageProps, CreateModelState> {
    constructor(props: CreateModelPageProps) {
        super(props);

        this.state = {
            formState: createFormState({model: {}}),
        };
    }

    onSubmit = async (value: FormState['value']) => {
        const modelMeta = this.props.model.modelMeta;

        await createModel(modelMeta, value.value);

        this.props.history.push(`/models/${modelMeta.namePlural}`)
    }

    render() {
        const { formState } = this.state;
        const { model } = this.props;
        return (
            <div>
                <h1>Add {model.modelMeta.name}</h1>
                <Form
                    formState={formState}
                    onSubmit={this.onSubmit}
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

export default withRouter(CreateModelPage)