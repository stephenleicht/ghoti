import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
    Route,
    Switch,
    Redirect,
    RouteComponentProps
} from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import Navigation from './components/Navigation';
import ModelListPage from './components/ModelListPage';
import ViewModelPage from './components/ViewModelPage';
import CreateModelPage from './components/CreateModelPage';
import LoginPage from './components//LoginPage';

import * as styles from './App.css';

interface AppProps {
    models: {
        [modelName: string]: any
    }
}

export default class App extends React.Component<AppProps, {}> {

    render() {
        const { models } = this.props;
        return (
            <Switch>
                <Route path="/login" component={LoginPage} />
                <AuthenticatedRoute path="/" render={() => {
                    return (
                        <div className={styles.appWrapper}>
                            <Navigation models={models} />
                            <Route path="/users" render={() => <div>Users Route</div>} />
                            <Route path="/models/:modelName" render={({ match }) => {
                                const model = models[match.params.modelName];
                                return (
                                    <Switch>
                                        <Route exact path="/models/:modelName" render={(props) => (
                                            <ModelListPage model={model} {...props} />
                                        )} />
                                        <Route path="/models/:modelName/create" render={(props) => (
                                            <CreateModelPage model={model} {...props} />
                                        )} />
                                        <Route path="/models/:modelName/:id" render={(props) => (
                                            <ViewModelPage model={model} {...props} />
                                        )} />
                                    </Switch>
                                )
                            }} />
                        </div>
                    )
                }} />
            </Switch>
        );
    }
}