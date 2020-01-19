import React from 'react';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import { UserDataAuth } from '../Classes/UserDataAuth';

export interface IProtectedRouteState {
}

export interface IProtectedRouteProps {
    children: JSX.Element,
    path: string
}

// https://reacttraining.com/react-router/web/example/auth-workflow
// https://tylermcginnis.com/react-router-protected-routes-authentication/
export class ProtectedRoute extends React.Component<IProtectedRouteProps, IProtectedRouteState> {
    public constructor(props: IProtectedRouteProps) {
        super(props);
        this.state = {
        }
    }

    private GetComponentToRender(): JSX.Element {
        var component: JSX.Element;
        component = (<Redirect to='/login' />);

        if (UserDataAuth.GetInstance().IsAuthenticated) {
            component = this.props.children;
        }

        return component;
    }

    public render() {
        return (
            <Route path={this.props.path} children={this.GetComponentToRender()} />
        );
    }
}
