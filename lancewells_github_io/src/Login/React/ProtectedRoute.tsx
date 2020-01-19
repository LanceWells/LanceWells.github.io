import React from 'react';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import { UserDataAuth } from '../Classes/UserDataAuth';

export interface IProtectedRouteState {
    routeStatus: TRouteCheckStatus;
}

export interface IProtectedRouteProps {
    children: JSX.Element,
    path: string
}

type TRouteCheckStatus = "Granted" | "Redirect" | "Checking"

// https://reacttraining.com/react-router/web/example/auth-workflow
// https://tylermcginnis.com/react-router-protected-routes-authentication/
export class ProtectedRoute extends React.Component<IProtectedRouteProps, IProtectedRouteState> {
    public constructor(props: IProtectedRouteProps) {
        super(props);
        this.state = {
            routeStatus: "Checking"
        }
    }

    private async CheckForAccess(): Promise<boolean> {
        var isAuthenticated: boolean = UserDataAuth.GetInstance().IsAuthenticated;

        if (!isAuthenticated) {
            isAuthenticated = await UserDataAuth.GetInstance().LoginUsingStoredCredentials();
        }

        return isAuthenticated;
    }

    componentDidMount() {
        this.GetComponentToRender();
    }

    private GetComponentToRender(): void {
        this.CheckForAccess().then(granted => {
            if (granted) {
                this.setState({
                    routeStatus: "Granted"
                });
            }
            else {
                this.setState({
                    routeStatus: "Redirect"
                });
            }
        })
    }

    public render() {
        switch(this.state.routeStatus) {
            case "Granted": {
                return (
                    <Route path={this.props.path} children={this.props.children} />
                );
            }
            case "Redirect": {
                return (
                    <Redirect to='/login' />
                );
            }
            case "Checking":
            default: {
                return (
                    <div>
                        <h2>Checking user authorization . . .</h2>
                    </div>
                );
            }
        }
    }
}
