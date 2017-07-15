import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import {FormState, createFormState} from '../forms/Form';
import ModelEditor from '../editor/ModelEditor';

import { createModel } from '../api';

interface CreateModelPageProps extends RouteComponentProps<any> {
    model: any,
}

interface CreateModelState {
    formState: FormState,
}


class CreateModelPage extends React.Component<CreateModelPageProps, CreateModelState> {
    constructor() {
        super();

        this.state = {
            formState: createFormState({}),
        };
    }

    onSubmit = async (newValue: any) => {
        const modelMeta = this.props.model.modelMeta;

        await createModel(modelMeta, newValue);

        this.props.history.push(`/models/${modelMeta.namePlural}`)
    }

    render() {
        const { formState } = this.state;
        const { model } = this.props;
        return (
            <div>
                <h1>Add {model.modelMeta.name}</h1>
                <ModelEditor
                    model={model}
                    onSubmit={this.onSubmit} 
                    formState={formState}
                    onChange={(newState: FormState) => this.setState({formState: newState})}  
                />
            </div>
        )
    }
}

export default withRouter(CreateModelPage)