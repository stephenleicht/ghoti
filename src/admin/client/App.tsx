import * as React from 'react';

import Form, { FormState, createFormState } from './forms/Form';
import ModelEditor from './editor/ModelEditor';

const model = (window as any).__ghotiMeta__.models.Person;

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <ModelEditor model={model} ></ModelEditor>
            </div>
        )
    }
}