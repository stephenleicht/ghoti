import * as React from 'react';

import Form, { FormState } from './forms/Form';
import TextInput from './forms/TextInput';
import TestComposite from './TestComposite';


interface AppState {
    formState: FormState
}

export default class App extends React.Component<{}, AppState> {
    constructor() {
        super();

        this.state = {
            formState: {
                isValid: true,
                value: {
                    outside: 'outside',
                    inside: 'inside',
                    extraInner: 'extraInner'
                },
                fields: {},
            }
        };

    }

    onFormStateChange = (newFormState: FormState) => {
        console.log('changing formState');
        this.setState({ formState: newFormState });
    }

    render() {
        return (
            <div>
                <Form formState={this.state.formState} onChange={this.onFormStateChange}>
                    <TextInput name="outside" />
                    <div>
                        <TextInput name="inside" />

                        <div>
                            <TextInput name="extraInner" />
                        </div>
                        <TextInput name="textInput" required/>

                        <TestComposite name="composite"/>
                    </div>
                </Form>
            </div>
        )
    }
}