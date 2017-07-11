import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';


import ModelEditor from '../editor/ModelEditor';

import { createModel } from '../api';

interface CreateModelPageProps extends RouteComponentProps<any> {
    model: any,
}

interface CreateModelState {
    saved: boolean,
}


class CreateModelPage extends React.Component<CreateModelPageProps, CreateModelState> {
    constructor() {
        super();

        this.state = {
            saved: false,
        }
    }

    onSubmit = async (newValue: any) => {
        const modelMeta = this.props.model.modelMeta;

        await createModel(modelMeta, newValue);

        this.props.history.push(`/models/${modelMeta.namePlural}`)
    }

    render() {
        const { saved } = this.state;
        const { model } = this.props;
        return (
            <div>
                {saved && <h4>Model Saved!</h4>}
                <ModelEditor model={model} onSubmit={this.onSubmit} />
            </div>
        )
    }
}

export default withRouter(CreateModelPage)