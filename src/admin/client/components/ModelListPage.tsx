import * as React from 'react';
import * as PropTypes from 'prop-types';

import { RouteComponentProps, Link } from 'react-router-dom';

interface ModelListPageProps {
    model: any,
}

export default class ModelListPage extends React.Component<ModelListPageProps, {}> {
    render() {
        const { model } = this.props;

        return (
            <div>
                <Link to={`/models/${model.modelMeta.namePlural}/create`}>Create {model.modelMeta.name}</Link>
                <br />
                List of {model.modelMeta.namePlural}
            </div>
        )
    }
}