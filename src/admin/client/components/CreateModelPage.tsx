import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class ModelListPage extends React.Component<RouteComponentProps<{modelName: string}>, {}> {
    render() {
        return (
            <div>
                Create Model Page
            </div>
        )
    }
}