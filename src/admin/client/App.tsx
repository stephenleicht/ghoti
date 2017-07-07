import * as React from 'react';

import Form, { FormState, createFormState } from './forms/Form';
import ModelEditor from './editor/ModelEditor';
import Navigation from './components/Navigation';

import { createModel } from './api';

import 'normalize.css';
import * as styles from './App.css';

const model = (window as any).__ghotiMeta__.models.Person;

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
        await createModel(model.modelMeta, newValue);
        
        this.setState({saved: true});
    }

    render() {
        const { saved } = this.state;

        return (
            <div className={styles.appWrapper}>
                <Navigation />
                <div className={styles.content}>
                    <ModelEditor model={model} onSubmit={this.onSubmit} />
                </div>
            </div>
        )
    }
}