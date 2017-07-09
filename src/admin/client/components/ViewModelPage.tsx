import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';


export default class ModelListPage extends React.Component<RouteComponentProps<{modelName: string}>, {}> {
    render() {
        const { match } = this.props;
        return (
            <div>
                View Model {match.params.modelName}
            </div>
        )
    }
}