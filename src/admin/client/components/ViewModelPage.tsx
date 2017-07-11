import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';


interface ViewModelPageProps {
    model: any,
}

export default class ViewModelPage extends React.Component<ViewModelPageProps, {}> {
    render() {
        const { model } = this.props;
        return (
            <div>
                View Model {model.modelMeta.name}
            </div>
        )
    }
}