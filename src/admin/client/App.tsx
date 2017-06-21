import * as React from 'react';

import Form, { FormState } from './forms/Form';
import TextInput from './forms/TextInput';

interface AppState {
    formState: FormState
}

export default class App extends React.Component<{}, AppState> {
    constructor() {
        super();

        this.state = {
            formState: {
                value: {
                    outside: 'outside',
                    inside: 'inside',
                    extraInner: 'extraInner'
                }
            }
        };

    }

    onFormStateChange = (newFormState: FormState) => {
        this.setState({ formState: newFormState });
    }

    render() {
        return (
            <div>
                <Form formState={this.state.formState} onChange={this.onFormStateChange}>
                    <input type="text" name="outside" />
                    <div>
                        <input type="text" name="inside" />

                        <div>
                            <input type="text" name="extraInner" />
                        </div>
                        <TextInput name="textInput" />
                    </div>
                </Form>
            </div>
        )
    }
}