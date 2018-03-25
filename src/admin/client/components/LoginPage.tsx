import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Form from '../forms/Form';
import { createFormState, FormState } from '../forms/Form/FormState';
import TextInput from '../forms/TextInput';

import { authenticate } from '../api';

export interface LoginPageState {
    formState: FormState,
    error: boolean,
}

export default class LoginPage extends React.Component<RouteComponentProps<{}>, LoginPageState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);

        this.state = {
            formState: createFormState({}),
            error: false
        };
    }

    onSubmit = async (formValue: any) => {
        const result = await authenticate(formValue.username, formValue.password);
        
        if(result) {
            this.props.history.push('/');
        }
        else {
            this.setState({error: true});
        }
    }

    render() {
        const { formState, error } = this.state;

        return (
            <div>
                <h3>Super cool login page</h3>
                {error && <div>Invalid username or password</div>}
                <div>
                    <Form
                        formState={formState}
                        onChange={(formState) => this.setState({ formState })}
                        onSubmit={this.onSubmit}
                    >
                        <div>
                            <label htmlFor="username">Username</label>
                            <TextInput name="username" required />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <TextInput name="password" required />
                        </div>
                        <button type="submit">Login</button>
                    </Form>
                </div>
            </div>
        )
    }
}