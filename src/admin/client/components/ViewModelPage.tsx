import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FormState, createFormState } from '../forms/Form';
import ModelEditor from '../editor/ModelEditor';

import { getModelByID, updateModel } from '../api';

export interface ViewModelPageParams {
    id: string
}

export interface ViewModelPageProps extends RouteComponentProps<ViewModelPageParams>{
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
            formState: createFormState(value),
        });
    }

    onEditorSubmit = async (value: any) => {
        const { history, match, model } = this.props;
        await updateModel(model.modelMeta, match.params.id, value);

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
                <ModelEditor 
                    formState={formState}
                    model={model}
                    onChange={(newState) => this.setState({formState: newState})}
                    onSubmit={this.onEditorSubmit}
                />
            </div>
        )
    }
}