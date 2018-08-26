import * as React from 'react';

import { RouteComponentProps, Link } from 'react-router-dom';

import { getUsersList, deleteUserByID } from '../api';
import { ModelMeta } from '../../../model';
import getIDKey from '../../../model/getIDKey';

export interface UsersListPageProps extends RouteComponentProps<{}> {
}

export interface UsersListPageState {
    usersList: any[]
}

export default class UsersListPage extends React.Component<UsersListPageProps, UsersListPageState> {
    constructor(props: UsersListPageProps) {
        super(props);

        this.state = {
            usersList: []
        }
    }
    componentDidMount() {
        this.getList()
    }

    componentWillReceiveProps(nextProps: UsersListPageProps) {
        if (nextProps.location === this.props.location) {
            return;
        }

        this.getList();
    }

    async getList() {
        const usersList = await getUsersList();

        this.setState({
            usersList,
        })
    }

    onDeleteClick = async (id: string) => {
        const result = await deleteUserByID(id);

        this.getList();
    }

    render() {
        const { usersList } = this.state;

        if (!usersList) {
            return <h1>Loading...</h1>
        }

        const renderableFields = ['email'];
        return (
            <div>
                <Link to={`/users/create`}>Create User</Link>
                <br />
                <table>
                    <thead>
                        <tr>
                            {renderableFields.map((key) => (
                                <td key={key}>{key}</td>
                            ))}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList
                            .map(user => (
                                <tr key={user.id}>
                                    {renderableFields.map(key => (
                                        <td key={key}>
                                            <Link to={`/users/${user.id}`}>{user[key]}</Link>
                                        </td>
                                    ))}
                                    <td>
                                        <button type="button" onClick={() => this.onDeleteClick(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        )
    }
}