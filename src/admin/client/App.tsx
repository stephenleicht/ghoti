import * as React from 'react';
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

import { createModel } from './api';

import 'normalize.css';
import * as styles from './App.css';


const models = (window as any).__ghotiMeta__.models

interface AppState {
    saved: boolean,
}

interface AppProps {
    models: {
        [modelName: string]: any
    }
}

export default class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();

        this.state = {
            saved: false,
        }
    }
    onSubmit = async (newValue: any) => {
        await createModel(models.Person.modelMeta, newValue);

        this.setState({ saved: true });
    }

    render() {
        const { saved } = this.state;
        const { models } = this.props;

        const personModel = models.Person;

        return (
            <Router basename="/admin">
                <div className={styles.appWrapper}>
                    <Navigation models={models} />
                    <Route path="/users" render={() => <div>Users Route</div>} />
                    <Switch>
                        <Route exact path="/models/:modelName" component={ModelListPage} />
                        <Route path="/models/:modelName/create" component={CreateModelPage} />
                        <Route path="/models/:modelName/:id" component={ViewModelPage} />
                    </Switch>
                </div>
            </Router>
        )
    }
}