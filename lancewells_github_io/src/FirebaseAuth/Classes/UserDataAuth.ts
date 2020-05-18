import * as BCrypt from 'bcryptjs';
import firebase from 'firebase';
import { CreateUserResponse } from '../Types/CreateUserResponse';
import { LoginResponse } from '../Types/LoginResponse';
import { AuthState } from '../Enums/AuthState';

/**
 * @description A class used for authorizing user credentials and fetching user data.
 */
export class UserDataAuth {
    /**
     * @description Describes the singleton instance for this class.
     */
    private static _instance: UserDataAuth;

    /**
     * @description Describes the current authorization state for user authorization.
     */
    private _authState: AuthState;

    /**
     * @description A salt used for BCrypt encryption whenever evaluating user passwords.
     */
    private salt: string;

    /**
     * @description The user's username that is being stored after authorizing user credentials.
     */
    private _username: string = "";

    /**
     * @description The maximum length of allowed passwords.
     */
    public static readonly MaxPasswordLength = 60;

    /**
     * @description Gets the username for the current logged-in user. This is not the name of the character,
     * but instead the e-mail address associated with this user's account.
     */
    public get Username(): string {
        return this._username;
    }

    /**
     * @description Gets the UID for the current user. This is the user's identification number. This is used
     * to index a large amount of user storage.
     */
    public GetUid(): string | undefined {
        let uid = firebase.auth().currentUser?.uid;
        if (!uid) {
            uid = undefined;
        }
        return uid;
    }

    /**
     * @description Logs out from any current user instances.
     */
    public Logout(): void {
        this._authState = AuthState.Unauthorized;
        firebase.auth().signOut();
    }

    /**
     * @description Logs into a user instance using an email-password combination.
     * @param email The email of the user to login.
     * @param password The password of the user to login.
     */
    public async Login(email: string, password: string): Promise<LoginResponse> {
        let loginResponse: LoginResponse = {
            DidLogin: false,
            Errors: []
        };

        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .catch(function (error) {
                let errorMessage = error.message;
                console.error(errorMessage);
                loginResponse.Errors.push(errorMessage);
            });

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() =>
                loginResponse.DidLogin = true
            )
            .catch((error) => {
                let errorMessage = error.message;
                console.error(errorMessage);
                loginResponse.Errors.push(errorMessage);
            });

        return loginResponse;
    }

    /**
     * @description Creates a new user asynchronously.
     * @param email The email of the new user to create.
     * @param password The password for the new user.
     * @param passwordDupe A duplicate of the password that the user has provided.
     */
    public async CreateAccount(email: string, password: string, passwordDupe: string): Promise<CreateUserResponse> {
        let createResponse: CreateUserResponse = {
            DidCreate: false,
            Errors: []
        };

        // This may be a little overkill, but don't compare plaintext passwords, use something more robust
        // like BCrypt to compare.
        let passwordHash: string = BCrypt.hashSync(password, this.salt);
        let passwordsMatch: boolean = BCrypt.compareSync(passwordDupe, passwordHash);

        // Validate that the passwords match.
        if (!passwordsMatch) {
            createResponse.Errors.push("Your passwords did not match.");
        }

        if (password.length < 6) {
            createResponse.Errors.push("Passwords must be at least 6 characters long.");
        }

        if (createResponse.Errors.length <= 0) {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then(
                fulfilledValue => {
                    createResponse.DidCreate = true;
                    console.log(fulfilledValue);
                }
                , rejectedValue => {
                    console.error(rejectedValue);
                    createResponse.Errors.push(rejectedValue.message);
                });
        }

        if (!createResponse.DidCreate) {
            createResponse.Errors.push("There was a problem when creating this account. Please try again.");
        }

        return createResponse;
    }

    /**
     * @description Checks for access being granted to the user.
     */
    public async CheckForAccess(): Promise<boolean> {
        if (this._authState === AuthState.Checking) {
            await new Promise<void>((resolve, reject) => {
                // Reject the promise if we wait > X seconds before getting a response.
                let timeoutWaiting = setTimeout(() => reject(), 10000);

                firebase.auth().onAuthStateChanged((user) => {
                    // If we got an answer, don't reject.
                    window.clearTimeout(timeoutWaiting);
                    resolve();
                });
            });
        }

        return this._authState === AuthState.Authorized;
    }

    /**
     * @description Gets the singleton instance of this object.
     */
    public static GetInstance(): UserDataAuth {
        if (!UserDataAuth._instance) {
            UserDataAuth._instance = new UserDataAuth();
        }

        return this._instance;
    }

    /**
     * @description Creates a new instance of this object.
     */
    private constructor() {
        this._authState = AuthState.Checking;
        this.salt = BCrypt.genSaltSync();

        // Your web app's Firebase configuration
        let firebaseConfig = {
            apiKey: "AIzaSyD-s5zfMiZavJc8J0qsCVIpzSysbaRG7kU",
            authDomain: "test-project-a4c30.firebaseapp.com",
            databaseURL: "https://test-project-a4c30.firebaseio.com",
            projectId: "test-project-a4c30",
            storageBucket: "test-project-a4c30.appspot.com",
            messagingSenderId: "553146248685",
            appId: "1:553146248685:web:b24bdb19f4a400f3550be4",
            measurementId: "G-Y6PMKS1PHP"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics()

        // Add a listener for auth state changing.
        firebase.auth().onAuthStateChanged(this.HandleAuthStateChanged.bind(this));
    }


    /**
     * @description Handles the user's authorization state changing.
     * @param user The user that was logged in, or null if the user was logged out.
     */
    private HandleAuthStateChanged(user: firebase.User | null): void {
        if (user) {
            this._authState = AuthState.Authorized;
            console.log("User " + user.uid + " has logged in.")

            let email = firebase.auth().currentUser?.email;
            if (email && email !== undefined) {
                this._username = email;
            }
        }
        else {
            // This means that either the auth has initialized, or that someone has logged out.
            this._authState = AuthState.Unauthorized;
            console.log("User has logged out.")
        }
    }
}
