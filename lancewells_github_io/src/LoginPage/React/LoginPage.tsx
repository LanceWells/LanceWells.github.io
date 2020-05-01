import React, { FormEvent, ChangeEvent } from 'react';
import '../LoginPage.css'
import { UserDataAuth } from '../../FirebaseAuth/Classes/UserDataAuth';
import { CreateUserResponse } from '../../FirebaseAuth/Types/CreateUserResponse';
import { LoginResponse } from '../../FirebaseAuth/Types/LoginResponse';
import { LoginState } from '../Enums/LoginState';
import { PlayerInventoryService } from '../../FirebaseAuth/Classes/PlayerInventoryService';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { PartType } from '../../CharacterImage/Enums/PartType';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';
import { BodyType } from '../../CharacterImage/Enums/BodyType';

/**
 * @description A series of properties to use to render this component.
 */
interface ILoginPageProps {
};

/**
 * @description An object used to maintain the internal state of this object.
 * @param pageState A stateful viariable used to keep track of what to display/provide as options.
 * @param errorMessages A set of error messages to display to the user.
 */
interface ILoginPageState {
    pageState: LoginState;
    errorMessages: string[];
}

/**
 * @description The login and account-creation form for this site.
 */
export class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
    private currentUsername: string;
    private currentPassword: string;
    private currentPassDupe: string;

    /**
     * Creates a new instance of this object.
     * @param props The series of properties passed in as input for this component.
     */
    public constructor(props: ILoginPageProps) {
        super(props);

        this.currentUsername = "";
        this.currentPassword = "";
        this.currentPassDupe = "";

        let loginState: LoginState = LoginState.CheckingCredentials;
        if (UserDataAuth.GetInstance().CheckForAccess()) {
            loginState = LoginState.LoggedIn;
        }

        this.state = {
            pageState: loginState,
            errorMessages: []
        };
    }

    /**
     * @description Fired immediately after this component has mounted. This is used to update the component
     * to reflect whether the user has logged in using stored credentials.
     */
    public componentDidMount() {
        UserDataAuth.GetInstance().CheckForAccess().then(granted => {
            if (granted) {
                this.setState({
                    pageState: LoginState.LoggedIn
                });
            } else {
                this.setState({
                    pageState: LoginState.Login
                })
            }
        }, onRejected => {
            console.error("Rejected login:" + onRejected);
            this.setState({
                pageState: LoginState.Login
            })
        })
    }

    private testUserAuth() {
        // let partMap: Map<PartType, string> = new Map();
        // partMap.set(PartType.ArmArmor, './images/Character_Image/Size_Average/Arm Armor/Androgynous/RedShoulderCloak.png');

        let testPlayerData: PlayerCharacterData = new PlayerCharacterData(
            "A new challenger!",
            5000,
            [
                {
                    key: 'Handaxe',
                    type: 'Weapon'
                },
                {
                    key: 'AngelicPotion',
                    type: 'Potion'
                }
            ],
            new CharImageLayout(new Map(), BodyType.AverageSizedMasculine),
            ""
        );

        PlayerInventoryService.CreateCharacterData(testPlayerData).then(() => {
            console.log(testPlayerData);
        });
    }

    /**
     * @description Renders thi object.
     */
    public render() {
        return (
            <div className="login-container">
                <button onClick={this.testUserAuth.bind(this)}>
                    Test Button
                </button>
                <div className="login-dialog">
                    <h2 className="login-header">
                        {this.state.pageState.toString()}
                    </h2>
                    <div className="login-error-messages">
                        {this.getErrorMessages()}
                    </div>
                    {this.GetInternalRenderBits()}
                </div>
            </div>
        );
    }

    /**
     * @description Renders the internal bits that change depending on the state of this component.
     */
    private GetInternalRenderBits(): JSX.Element {
        switch (this.state.pageState) {
            case LoginState.LoggedIn: {
                return (
                    <div>
                        <h3>You are logged in as {UserDataAuth.GetInstance().Username}</h3>
                        <br /><br />
                        <div className="login-button-container">
                            <button className="login-button" onClick={this.submitLogout.bind(this)}>
                                Log Out
                            </button>
                        </div>
                    </div>
                )
            }
            case LoginState.CreateAnAccount: {
                return (
                    <div>
                        <form className="login-form" action="/" method="POST" onSubmit={this.submitCreateAccount.bind(this)}>
                            <br /> <br />
                            <span>Email:</span>
                            <br />
                            <input type="text" name="email" onChange={this.handleUsernameInput.bind(this)} />
                            <br /> <br />
                            <span>Password:</span>
                            <br />
                            <input type="password" name="password" onChange={this.handlePasswordInput.bind(this)} />
                            <br /> <br />
                            <span>Password (Again!):</span>
                            <br />
                            <input type="password" name="passwordDupe" onChange={this.handlePassDupeInput.bind(this)} />
                            <br /> <br />
                            <input
                                className="login-button"
                                type="submit"
                                style={{ display: "initial" }}
                                value="Create Account" />
                        </form>
                        <div className="login-button-container">
                            <button
                                className="login-button"
                                onClick={this.submitBackToLogin.bind(this)}>
                                Back To Login
                            </button>
                        </div>
                    </div>
                )
            }
            case LoginState.CheckingCredentials: {
                return (
                    <div>
                        <h2>Checking login credentials . . . </h2>
                    </div>
                )
            }
            case LoginState.Login:
            default: {
                return (
                    <div>
                        <form className="login-form" action="/" method="POST" onSubmit={this.submitLogin.bind(this)}>
                            <br /> <br />
                            <span>Email:</span>
                            <br />
                            <input type="text" name="email" onChange={this.handleUsernameInput.bind(this)} />
                            <br /> <br />
                            <span>Password:</span>
                            <br />
                            <input type="password" name="password" onChange={this.handlePasswordInput.bind(this)} />
                            <br /> <br />
                            <input
                                className="login-button"
                                style={{ display: "initial" }}
                                type="submit"
                                value="Log In" />
                        </form>
                        <div className="login-button-container">
                            <button
                                className="login-button"
                                onClick={this.submitGoToCreateAccount.bind(this)}>
                                Create An Account
                            </button>
                        </div>
                    </div>
                )
            }
        }
    }

    /**
     * @description Gets a series of error messages to render from the current state.
     */
    private getErrorMessages(): JSX.Element[] {
        return (
            this.state.errorMessages.map(e => {
                return (
                    <p>{e}</p>
                )
            })
        )
    }

    /**
     * @description Handles the click event for the 'submit' button when the user is logging in.
     * @param event The event to handle when the user presses, "Login".
     */
    private submitLogin(event: FormEvent<HTMLFormElement>) {
        // By default, this causes the page to refresh which we DO NOT WANT. This happens because the provided
        // form looks to browsers like a standard login form.
        event.preventDefault();

        // Attempt to log in using UserDataAuth.
        let loginPromise: Promise<LoginResponse> = UserDataAuth.GetInstance().Login(this.currentUsername, this.currentPassword);

        this.setState({
            pageState: LoginState.CheckingCredentials
        });

        loginPromise.then(
            loggedIn => {
                if (loggedIn.DidLogin) {
                    this.setState({
                        pageState: LoginState.LoggedIn
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

    /**
     * @description Handles when the user selects the "Logout" button.
     */
    private submitLogout() {
        // Logout from the user data auth.
        UserDataAuth.GetInstance().Logout();

        // Set page state to LoggingOut, which should redirect to the home page.
        this.setState({
            pageState: LoginState.Login
        });
    }

    /**
     * @description Handles when the user selects the "Create an account" button.
     * @param event The event arguments provided when a user creates an account.
     */
    private submitCreateAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let response: Promise<CreateUserResponse> = UserDataAuth.GetInstance().CreateAccount(
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
                        pageState: LoginState.LoggedIn
                    });
                }
            }, onReject => {
                console.error("Failed to create a user account." + onReject);
            }
        )
    }

    /**
     * @description Handles the click event when a user goes to the 'Create An Account' button.
     */
    private submitGoToCreateAccount() {
        this.setState({
            pageState: LoginState.CreateAnAccount
        });
    }

    /**
     * @description Handles when a user selects the "Back To Login" button.
     */
    private submitBackToLogin() {
        this.setState({
            pageState: LoginState.Login
        });
    }

    /**
     * @description Handles when the user types/provides input into the username field.
     * @param event The event arguments provided when the user is changing the username field.
     */
    private handleUsernameInput(event: ChangeEvent<HTMLInputElement>) {
        let input = event.target?.value;
        if (input !== null) {
            this.currentUsername = input;
        }
    }

    /**
     * @description Handles when the user types/provides input into the password field.
     * @param event The event arguments provided when the user is changing the field.
     */
    private handlePasswordInput(event: ChangeEvent<HTMLInputElement>) {
        let input = event.target?.value;
        if (input !== null) {
            this.currentPassword = input;
        }
    }

    /**
     * @description Handles when the user types/provides input into the password verification field.
     * @param event The event arguments provided when the user is changing the field.
     */
    private handlePassDupeInput(event: ChangeEvent<HTMLInputElement>) {
        let input = event.target?.value;
        if (input !== null) {
            this.currentPassDupe = input;
        }
    }
}
