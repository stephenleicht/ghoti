import * as React from 'react';
import * as PropTypes from 'prop-types';

import { RouteComponentProps, Link } from 'react-router-dom';

import { getModelList, deleteModelByID } from '../api';
import { ModelMeta } from '../../../model';
import getIDKey from '../../../model/getIDKey';

export interface ModelListPageProps extends RouteComponentProps<{}> {
    model: any,
}

export interface ModelListPageState {
    modelsList: any[]
}

export default class ModelListPage extends React.Component<ModelListPageProps, ModelListPageState> {
    constructor(props: ModelListPageProps) {
        super(props);

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

        if(nextProps.model === this.props.model){
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
        const result = await deleteModelByID(this.props.model.modelMeta, id);

        this.getList();
    }

    renderDisplayValue(fieldName: string, value: any) {
        if (Array.isArray(value[fieldName])) {
            return '[]';
        }

        if(this.props.model.modelMeta.fields[fieldName].type.modelMeta) {
            //TODO: have some sort of display value configuration on ghoti model
            return '{}';
        }
        
        return value[fieldName];
    }

    render() {
        const { model } = this.props;
        const { modelsList } = this.state;

        if (!modelsList) {
            return <h1>Loading...</h1>
        }

        const modelMeta: ModelMeta = model.modelMeta;
        const idKey = getIDKey(modelMeta);

        const renderableFields = Object.keys(modelMeta.fields).filter(key => key !== idKey);
        return (
            <div>
                <Link to={`/models/${modelMeta.namePlural}/create`}>Create {modelMeta.name}</Link>
                <br />
                <table>
                    <thead>
                        <tr>
                            {renderableFields.map((key) => (
                                <td key={key}>{key}</td>
                            ))}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {modelsList
                            .map(m => (
                                <tr key={m[idKey]}>
                                    {renderableFields.map(key => (
                                        <td key={key}>
                                            <Link to={`/models/${modelMeta.namePlural}/${m[idKey]}`}>{this.renderDisplayValue(key, m)}</Link>
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