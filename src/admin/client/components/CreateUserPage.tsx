import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import {
    FormState,
    createFormState,
    Form,
} from '../forms';
import TextInput from './inputs/TextInput'

import { createUser } from '../api';

export interface CreateUserPageProps extends RouteComponentProps<any> {
}

interface CreateUserPageState {
    formState: FormState,
}

class CreateUserPage extends React.Component<CreateUserPageProps, CreateUserPageState> {
    constructor(props: CreateUserPageProps) {
        super(props);

        this.state = {
            formState: createFormState({}),
        };
    }

    onSubmit = async (newValue: any) => {
        await createUser(newValue);

        this.props.history.push('/users');
    }

    render() {
        const { formState } = this.state;

        return (
            <div>
                <h1>Create User</h1>
                <Form
                    onSubmit={this.onSubmit}
                    formState={formState}
                    onChange={(newState: FormState) => this.setState({ formState: newState })}
                >
                    <div>
                        <label htmlFor="email">Email</label>
                        <TextInput name="email" required />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <TextInput name="password" required />
                    </div>
                    <button type="submit">Create User</button>
                </Form>
            </div>
        )
    }
}

export default withRouter(CreateUserPage)