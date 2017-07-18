import * as React from 'react';
import * as PropTypes from 'prop-types';

import { RouteComponentProps, Link } from 'react-router-dom';

import { getModelList, deleteByID } from '../api';
import { ModelMeta } from '../../../model';
import getIDKey from '../../../model/getIDKey';

export interface ModelListPageParams {
    modelName: string
}

export interface ModelListPageProps extends RouteComponentProps<ModelListPageParams> {
    model: any,
}

export interface ModelListPageState {
    modelsList: any[]
}

export default class ModelListPage extends React.Component<ModelListPageProps, ModelListPageState> {
    constructor() {
        super();

        this.state = {
            modelsList: []
        }
    }
    componentDidMount() {
        this.getList()
    }

    componentWillReceiveProps(nextProps: ModelListPageProps) {
        if (nextProps.location === this.props.location) {
            return;
        }

        if (nextProps.match.params.modelName === this.props.match.params.modelName) {
            return;
        }

        this.getList(nextProps.model);
    }

    async getList(model = this.props.model) {
        const modelsList = await getModelList(model.modelMeta);

        this.setState({
            modelsList,
        })
    }

    onDeleteClick = async (id: string) => {
        const result = await deleteByID(this.props.model.modelMeta, id);

        this.getList();
    }

    render() {
        const { model } = this.props;
        const { modelsList } = this.state;

        if (!modelsList) {
            return <h1>Loading...</h1>
        }

        const modelMeta: ModelMeta = model.modelMeta;
        const idKey = getIDKey(modelMeta);

        const fieldKeysNoID = Object.keys(modelMeta.fields).filter(key => key !== idKey);
        return (
            <div>
                <Link to={`/models/${modelMeta.namePlural}/create`}>Create {modelMeta.name}</Link>
                <br />
                <table>
                    <thead>
                        <tr>
                            {fieldKeysNoID.map((key) => (
                                <td key={key}>{key}</td>
                            ))}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {modelsList
                            .map(m => (
                                <tr key={m[idKey]}>
                                    {fieldKeysNoID.map(key => (
                                        <td key={key}>
                                            <Link to={`/models/${modelMeta.namePlural}/${m[idKey]}`}>{m[key]}</Link>
                                        </td>
                                    ))}
                                    <td>
                                        <button type="button" onClick={() => this.onDeleteClick(m[idKey])}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        )
    }
}