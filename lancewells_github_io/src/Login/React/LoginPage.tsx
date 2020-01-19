import React, { FormEvent, ChangeEvent } from 'react';
import './LoginPage.css'
import { UserDataAuth, CreateUserResponse } from '../Classes/UserDataAuth';
import { Redirect } from 'react-router-dom';

type LoginPageState = "Login" | "LoggingIn" | "LoggedIn" | "LoggingOut" | "CreateAnAccount";

interface ILoginPageProps {
};

interface ILoginPageState {
    pageState: LoginPageState;
    errorMessages: string[];
}

export class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
    private currentUsername: string;
    private currentPassword: string;
    private currentPassDupe: string;

    constructor(props: ILoginPageProps) {
        super(props);

        this.currentUsername = "";
        this.currentPassword = "";
        this.currentPassDupe = "";

        var loginState: LoginPageState = "Login";
        if (UserDataAuth.GetInstance().IsAuthenticated) {
            loginState = "LoggedIn";
        }

        this.state = {
            pageState: loginState,
            errorMessages: []
        };
    }

    private submitLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Attempt to log in using UserDataAuth.
        var loginPromise: Promise<boolean> = UserDataAuth.GetInstance().Login(this.currentUsername, this.currentPassword);

        loginPromise.then(
            loggedIn => {
                if (loggedIn) {
                    this.setState({
                        pageState: "LoggedIn"
                    });
                }
                else {
                    this.setState({
                        errorMessages: ["That username and password was not valid. Please try again."]
                    });
                }
            }
        )
    }

    private submitLogout() {
        // Logout from the user data auth.
        UserDataAuth.GetInstance().Logout();

        // Set page state to LoggingOut, which should redirect to the home page.
        this.setState({
            pageState: "LoggingOut"
        });
    }

    private submitCreateAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        var response: Promise<CreateUserResponse> = UserDataAuth.GetInstance().CreateAccount(
            this.currentUsername,
            this.currentPassword,
            this.currentPassDupe);

        response.then(
            onResolve => {
                // Always set the error list to whatever we got. This way it clears when we have no errors.
                this.setState({
                    errorMessages: onResolve.Errors
                });

                if (onResolve.DidCreate) {
                    this.setState({
                        pageState: "LoggedIn"
                    });
                }
            },  onReject => {
                console.error("Failed to create a user account.");
            }
        )
    }

    private submitGoToCreateAccount() {
        this.setState({
            pageState: "CreateAnAccount"
        });
    }

    private submitBackToLogin() {
        this.setState({
            pageState : "Login"
        });
    }

    private handleUsernameInput(event: ChangeEvent<HTMLInputElement>) {
        var input = event.target?.value;
        if (input !== null) {
            this.currentUsername = input;
        }
    }

    private handlePasswordInput(event: ChangeEvent<HTMLInputElement>) {
        var input = event.target?.value;
        if (input !== null) {
            this.currentPassword = input;
        }
    }
    
    private handlePassDupeInput(event: ChangeEvent<HTMLInputElement>) {
        var input = event.target?.value;
        if (input !== null) {
            this.currentPassDupe = input;
        }
    }

    private getErrorMessages(): JSX.Element[] {
        return (
            this.state.errorMessages.map( e => {
                return(
                    <span>{e}</span>
                )
            })
        )
    }

    // https://gist.github.com/elitan/5e4cab413dc201e0598ee05287ee4338
    // https://www.carlrippon.com/building-super-simple-react-form-component-typescript-basics/
    render() {
        switch (this.state.pageState) {
            case "Login": {
                return (
                    <div className="login-container">
                        <h2 className="login-header">
                            Login
                        </h2>
                        <p className="login-error-messages">
                            {this.getErrorMessages()}
                        </p>
                        <form className="login-form" action="/" method="POST" onSubmit={this.submitLogin.bind(this)}>
                            <br /> <br />
                            <span>Username:</span>
                            <br />
                            <input type="text" name="username" onChange={this.handleUsernameInput.bind(this)} />
                            <br /> <br />
                            <span>Password:</span>
                            <br />
                            <input type="password" name="password" onChange={this.handlePasswordInput.bind(this)} />
                            <br /> <br />
                            <input className="login-button" type="submit" value="Log In" />
                        </form>
                        <button
                            className="login-button"
                            onClick={this.submitGoToCreateAccount.bind(this)}>
                            Create An Account
                        </button>
                    </div>
                );
            }
            case "LoggingIn": {
                return (
                    <Redirect to="/" />
                )
            }
            case "LoggedIn": {
                return (
                    <div className="login-container">
                        <h2 className="login-header">
                            Logged In
                        </h2>
                        <h3>You are logged in as {UserDataAuth.GetInstance().Username}</h3>
                        <br /><br />
                        <button className="login-button" onClick={this.submitLogout.bind(this)}>
                            Log Out
                        </button>
                    </div>
                )
            }
            case "LoggingOut": {
                return (
                    <Redirect to="/" />
                );
            }
            case "CreateAnAccount": {
                return (
                    <div className="login-container">
                        <h2 className="login-header">
                            Create An Account
                        </h2>
                        <p className="login-error-messages">
                            {this.getErrorMessages()}
                        </p>
                        <form className="login-form" action="/" method="POST" onSubmit={this.submitCreateAccount.bind(this)}>
                            <br /> <br />
                            <span>Username:</span>
                            <br />
                            <input type="text" name="username" onChange={this.handleUsernameInput.bind(this)} />
                            <br /> <br />
                            <span>Password:</span>
                            <br />
                            <input type="password" name="password" onChange={this.handlePasswordInput.bind(this)} />
                            <br /> <br />
                            <span>Password Duplicate:</span>
                            <br />
                            <input type="password" name="passwordDupe" onChange={this.handlePassDupeInput.bind(this)} />
                            <br /> <br />
                            <input className="login-button" type="submit" value="Create Account" />
                        </form>
                        <button
                            className="login-button"
                            onClick={this.submitBackToLogin.bind(this)}>
                            Back To Login
                        </button>
                    </div>
                )
            }
            default: {
                return (
                    <div className="login-container">
                        <h2 className="login-header">
                            Login Page
                        </h2>
                    </div>
                )
            }
        }
    }
}
