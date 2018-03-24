import * as React from 'react';
import { withRouter, Route, RouteComponentProps, RouteProps } from 'react-router-dom';

import { SessionSummary } from '../../../api/SessionSummary';

import { getSessionInfo } from '../api';

export interface AuthenticatedRouteState {
    isAuthenticating: boolean,
    session: null | SessionSummary
}

export interface AuthenticatedRouteProps extends RouteProps{}


export class AuthenticatedRoute extends React.Component<AuthenticatedRouteProps & RouteComponentProps<any>, AuthenticatedRouteState> {
    constructor(props: AuthenticatedRouteProps & RouteComponentProps<any>) {
        super(props);

        this.state = {
            isAuthenticating: true,
            session: null,
        };
    }

    componentDidMount() {
        this.checkAuth();
    }

    componentDidUpdate(prevProps: RouteComponentProps<{}>) {
        if(this.props.location !== prevProps.location) {
            this.checkAuth();
        }
    }

    async checkAuth() {
        if(this.state.session) {
            return true;
        }

        const result = await getSessionInfo();
        if (!result) {
            this.props.history.push('/login');
            return;
        }

        this.setState({
            isAuthenticating: false,
            session: result
        });
    }
    render() {
        return (
            <Route {...this.props} />
        )
    }
}

export default withRouter(AuthenticatedRoute)