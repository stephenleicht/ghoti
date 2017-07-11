import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import Form, { FormState, createFormState } from './forms/Form';
import ModelEditor from './editor/ModelEditor';
import Navigation from './components/Navigation';
import ModelListPage from './components/ModelListPage';
import ViewModelPage from './components/ViewModelPage';
import CreateModelPage from './components/CreateModelPage';

import * as styles from './App.css';

interface AppState {
    saved: boolean,
}

interface AppProps {
    models: {
        [modelName: string]: any
    }
}

export default class App extends React.Component<AppProps, AppState> {
    render() {
        const { models } = this.props;

        const personModel = models.Person;

        return (
            <Router basename="/admin">
                <div className={styles.appWrapper}>
                    <Navigation models={models} />
                    <Route path="/users" render={() => <div>Users Route</div>} />
                    <Route path="/models/:modelName" render={({match, ...rest}) => {
                        const model = models[match.params.modelName];
                        return (
                            <Switch>
                                <Route exact path="/models/:modelName" render={() => <ModelListPage model={model} />} />
                                <Route path="/models/:modelName/create" render={() => <CreateModelPage model={model} match={match} {...rest}/>} />
                                <Route path="/models/:modelName/:id" render={() => <ViewModelPage model={model} />} />
                            </Switch>
                        )
                    }}/>
                </div>
            </Router>
        );
    }
}