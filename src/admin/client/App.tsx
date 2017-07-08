import * as React from 'react';

import Form, { FormState, createFormState } from './forms/Form';
import ModelEditor from './editor/ModelEditor';
import Navigation from './components/Navigation';

import { createModel } from './api';

import 'normalize.css';
import * as styles from './App.css';


const models = (window as any).__ghotiMeta__.models

interface AppState {
    saved: boolean,
}

export default class App extends React.Component<{}, AppState> {
    constructor() {
        super();

        this.state = {
            saved: false,
        }
    }
    onSubmit = async (newValue: any) => {
        await createModel(models.Person.modelMeta, newValue);
        
        this.setState({saved: true});
    }

    render() {
        const { saved } = this.state;

        const personModel = models.Person;

        return (
            <div className={styles.appWrapper}>
                <Navigation models={models} />
                <div className={styles.content}>
                    <ModelEditor model={personModel} onSubmit={this.onSubmit} />
                </div>
            </div>
        )
    }
}