// import * as AWS from 'aws-sdk';
import { LantsPantsUserData } from './LantsPantsUserData';
import * as BCrypt from 'bcryptjs';
import firebase from 'firebase';

/**
 * Describes a response from authorization against the database.
 */
interface AuthResponse {
    /**
     * Describes the user data, after being authorized. This is undefined unless the user has provided
     * valid credentials, either thorugh a saved temp auth token or through user input.
     */
    AuthData: string | undefined;

    /**
     * True if the user is valid, and has access to the user data in the database.
     */
    UserValid: boolean;
}

export interface LoginResponse {
    DidLogin: boolean;
    Errors: string[];
}

export type TAuthState = "Authorized" | "Unauthorized" | "Checking";

/**
 * Describes a response from creating a userin the database.
 */
export interface CreateUserResponse {
    /**
     * True if the user was successfully created in the database. False otherwise.
     */
    DidCreate: boolean;

    /**
     * A list of any errors that were encountered when attempting to create a user.
     */
    Errors: string[];
}

/**
 * A class used for authorizing user credentials and fetching user data.
 */
export class UserDataAuth {
    /**
     * Describes the singleton instance for this class.
     */
    private static _instance: UserDataAuth;

    // /**
    //  * True if the user has been authenticated and is able to access protected resources.
    //  */
    // private _isAuthenticated: boolean;

    private _authState: TAuthState;

    /**
     * The database table index for the temporary auth token attribute on a given user data.
     */
    private static readonly tempAuthTableIndex: string = "tempauthtoken";

    /**
     * The database table inde4x for the username attribute on a given user data.
     */
    private static readonly usernameTableIndex: string = "username";

    /**
     * The local storage index for a user's temporary auth token.
     */
    private static readonly tempAuthStorageIndex: string = "TempAuthToken";

    /**
     * The local storage index for a user's username.
     */
    private static readonly usernameStorageIndex: string = "Username";

    /**
     * The name of the table that the user data is being stored in.
     */
    private static readonly userTableName: string = "LantsPants.UserDataStorage";


    /**
     * A salt used for BCrypt encryption whenever evaluating user passwords.
     */
    private salt: string;

    /**
     * The user data that is being stored after authorizing user credentials.
     */
    private _userData: LantsPantsUserData | undefined;

    /**
     * The user's username that is being stored after authorizing user credentials.
     */
    private _username: string = "";

    // private RefreshCredentials(): void {
    //     this.DynamoDb.config.update({
    //         region: 'us-east-2',
    //         accessKeyId: process.env.REACT_APP_DYNAMO_KEY,
    //         secretAccessKey: process.env.REACT_APP_DYNAMODB_SECRET_KEY
    //     });
    // }

    /**
     * Generates a temporary auth token based on a username and the current time.
     * @param username The username that an auth token is being generated for.
     */
    private GenerateTempAuth(username: string): string  {
        var today = new Date();
        var dateString: string = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
        var authStringToEncode: string = username + dateString;

        var tempAuthToken: string = BCrypt.hashSync(authStringToEncode, this.salt);
        return tempAuthToken;
    }

    /**
     * Checks for an existing user. Returns a promise indicating (true) if the user already exists,
     * otherwise (false).
     * @param username The username that is being checked for.
     */
    private async CheckForExistingUser(username: string): Promise<boolean> {

        var userExists: boolean = true;

        // var queryItemParams: AWS.DynamoDB.QueryInput = {
        //     TableName: UserDataAuth.userTableName,
        //     ExpressionAttributeValues: {
        //         ':givenUsername': {S: username}
        //     },
        //     KeyConditionExpression: 'username = :givenUsername'
        // }

        // var queryPromise = this.DocClient.query(queryItemParams).promise();

        // await queryPromise.then(
        //     onResolve => {
        //         console.log("CheckForUserResults", onResolve);
        //         if (onResolve.Items === undefined || onResolve.Count === undefined || onResolve.Count !== 0) {
        //             userExists = true;
        //         }
        //         else {
        //             userExists = false;
        //         }
        //     }, onReject => {
        //         console.error("Failed DB check for existing user.");
        //     }
        // )

        return userExists;
    }

    /**
     * Attempts to create a user with the given username and password hash.
     * @param username The username to create the user with.
     * @param passwordHash The password to create the user with.
     */
    private async CreateUser(username: string, passwordHash: string): Promise<void> {
        // var putItemParams = {
        //     TableName: UserDataAuth.userTableName,
        //     Item: {
        //         username: { S: username },
        //         passhash: { S: passwordHash }
        //     }
        // }

        // // Try to create a user account.
        // return new Promise<void>((resolve, reject) => {
        //     this.DocClient.put(putItemParams, function(err, data) {
        //         if (err) {
        //             console.log(err);
        //             reject(data);
        //         } else {
        //             console.log(data);
        //             resolve();
        //         }
        //     })
        // })
    }

    /**
     * Attempts to sign in using user-provided credentials.
     * @param usernameInput The username to attempt the sign-in with.
     * @param passwordHash The password that the user is attempting to sign-in with.
     */
    private async SignInUsingCredentials(usernameInput: string, passwordInput: string): Promise<AuthResponse> {
        var authResponse: AuthResponse = {
            AuthData: "",
            UserValid: false
        };

        // // Don't strongly type this. There's a potential bug with the way that the doc client observes
        // // types where any strongly typed parameters given to doc client functions will claim that the
        // // provided key does not match the table schema.
        // //
        // // Something interesting to note: It's fine to use the strongly typed variant but ONLY if the
        // // input vars are provided as string literals, and NOT as variables.
        // var getItemParams = {
        //     TableName: UserDataAuth.userTableName,
        //     Key: {"username": usernameInput}
        // }

        // // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
        // var getResult = await this.DocClient.get(getItemParams, function(err, data) {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(data);
        //     }
        // }).promise();

        // if (getResult !== undefined
        //     && getResult.Item !== undefined
        //     && getResult.Item.passhash !== undefined) {

        //     var userPassHash = getResult.Item.passhash as string;
        //     var passwordMatchesHash = BCrypt.compareSync(passwordInput, userPassHash);

        //     if (passwordMatchesHash) {
        //         var userData: string | undefined = undefined;
        //         var userDataAttribute = getResult.Item.userdata;

        //         if (userDataAttribute !== undefined) {
        //             userData = getResult.Item.userdata as string | undefined;
        //         }

        //         authResponse = {
        //             AuthData: userData,
        //             UserValid: true
        //         }
        //     }
        // }

        // if (authResponse.UserValid) {
        //     var tempAuthToken: string = this.GenerateTempAuth(usernameInput);

        //     var updateParams = {
        //         TableName: UserDataAuth.userTableName,
        //         Key: { "username": usernameInput },
        //         UpdateExpression: `set ${UserDataAuth.tempAuthTableIndex} = :auth`,
        //         ExpressionAttributeValues: {
        //             ":auth": tempAuthToken
        //         },
        //         ReturnValues:"UPDATED_NEW"
        //     }

        //     var updateResult = await this.DocClient.update(updateParams, function(err, data){
        //         if (err) {
        //             console.error(err);
        //         } else {
        //             console.log(data);
        //         }
        //     }).promise();

        //     // If the result isn't undefined, assume that we had a succesful run.
        //     if (updateResult !== undefined) {
        //         localStorage.setItem(UserDataAuth.tempAuthStorageIndex, tempAuthToken);
        //         localStorage.setItem(UserDataAuth.usernameStorageIndex, usernameInput);
        //     }
        // }

        return authResponse;
    }

    /**
     * Attempts to sing in using a saved temporary authorization token. This should be stored inside a
     * user's local storage, and not entered manually.
     * @param username The username that is used to sign in with.
     * @param authToken The temporary authorization token that the user is attempting to sign in with.
     */
    private async SignInUsingTempAuthToken(username: string, authToken: string): Promise<AuthResponse> {
        var authResponse: AuthResponse = {
            AuthData: "",
            UserValid: false
        };

        // var getItemParams = {
        //     TableName: UserDataAuth.userTableName,
        //     Key: { "username": username }
        // }

        // // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
        // var queryResult = await this.DocClient.get(getItemParams, function(err, data) {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(data);
        //     }
        // }).promise();
        
        // if (   queryResult !== undefined
        //     && queryResult.Item !== undefined)
        // {
        //     var dbAuthTokenAttribute = queryResult.Item.tempauthtoken;

        //     if (dbAuthTokenAttribute !== undefined && dbAuthTokenAttribute === authToken) {
        //         var userData: string | undefined = undefined;
        //         var userDataAttribute = queryResult.Item.userdata;

        //         if (userDataAttribute !== undefined) {
        //             userData = queryResult.Item.userdata as string | undefined;
        //         }

        //         authResponse = {
        //             AuthData: userData,
        //             UserValid: true
        //         }
        //     }
        // }

        return authResponse;
    }

    /**
     * The maximum length of allowed passwords.
     */
    public static readonly MaxPasswordLength = 60;

    // /**
    //  * 
    //  */
    // public get IsAuthenticated(): boolean {
    //     return this._isAuthenticated;
    // }

    public get AuthState(): TAuthState {
        return this._authState;
    }

    /**
     * 
     */
    public get UserData(): LantsPantsUserData | undefined {
        return this._userData;
    }

    public get Username(): string {
        return this._username;
    }

    /**
     * 
     */
    private constructor() {
        // this._isAuthenticated = false;
        this._authState = "Checking";
        this._userData = undefined;
        this.salt = BCrypt.genSaltSync();

        // Your web app's Firebase configuration
        var firebaseConfig = {
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
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                UserDataAuth.GetInstance()._authState = "Authorized";
                console.log("User " + user.uid + " has logged in.")
            }
            else {
                // This means that either the auth has initialized, or that someone has logged out.
                UserDataAuth.GetInstance()._authState = "Unauthorized";
                console.log("User has logged out.")
            }
        });
    }

    /**
     * 
     */
    public Logout(): void {
        firebase.auth().signOut();
        // // Set auth to false
        // this._isAuthenticated = false;

        // // Delete local credentials
        // localStorage.removeItem(UserDataAuth.tempAuthStorageIndex);
        // localStorage.removeItem(UserDataAuth.usernameStorageIndex);
    }

    private GetUserDataFromJson(json: string | undefined): LantsPantsUserData {
        var userData: LantsPantsUserData = new LantsPantsUserData();

        // If the response contained auth data, that means that this person has something
        // saved. Update what their user data should be.
        if (json !== undefined) {
            var parsedJson = JSON.parse(json);
            Object.assign(userData, parsedJson);
        }

        return userData;
    }

    /**
     * 
     * @param email 
     * @param password 
     */
    public async Login(email: string, password: string): Promise<LoginResponse> {
        var loginResponse: LoginResponse = {
            DidLogin: false,
            Errors: []
        };

        // var response: AuthResponse = await this.SignInUsingCredentials(email, password);
        var username: string | null | undefined = null;
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function() {
                return firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function (credentials: firebase.auth.UserCredential) {
                        loginResponse.DidLogin = true;
                        username = credentials.additionalUserInfo?.username;
                    })
                    .catch(function (error) {
                        var errorMessage = error.message;
                        console.error(errorMessage);
                        loginResponse.Errors.push(errorMessage);
                    });
            })
            .catch(function(error) {
                var errorMessage = error.message;
                console.error(errorMessage);
                loginResponse.Errors.push(errorMessage);
            });
        
        // if (loginResponse.Errors.length <= 0) {
        //     await firebase.auth().signInWithEmailAndPassword(email, password)
        //         .then(function(credentials: firebase.auth.UserCredential) {
        //             loginResponse.DidLogin = true;
        //             username = credentials.additionalUserInfo?.username;
        //         })
        //         .catch(function(error) {
        //             var errorMessage = error.message;
        //             console.error(errorMessage);
        //             loginResponse.Errors.push(errorMessage);
        //         });
        // }
        // // if (credentials.user)

        // if (credentials.user) {
        //     response.UserValid = true;
        // }

        // if (response.UserValid) {
        //     let userData: LantsPantsUserData = this.GetUserDataFromJson(response.AuthData);
        //     this._userData = userData;
        //     this._username = email;
        //     this._isAuthenticated = true;
        // }

        // if (loginResponse.DidLogin) {
        //     this = true;
        // }

        return loginResponse;
    }

    // /**
    //  * 
    //  */
    // public async LoginUsingStoredCredentials(): Promise<boolean> {
    //     // var tempAuthToken: string | null = localStorage.getItem(UserDataAuth.tempAuthStorageIndex);
    //     // var username: string | null = localStorage.getItem(UserDataAuth.usernameStorageIndex);

    //     // var response: AuthResponse = {
    //     //     AuthData: "",
    //     //     UserValid: false
    //     // };

    //     // firebase.auth().app.auth.

    //     // var currentUser = firebase.auth().currentUser;
    //     // if (currentUser) {
    //     //     response.UserValid = true;
    //     // }

    //     // if (tempAuthToken && username) {
    //     //     response = await this.SignInUsingTempAuthToken(username, tempAuthToken);
    //     //     if (response.UserValid) {
    //     //         let userData: LantsPantsUserData = this.GetUserDataFromJson(response.AuthData);
    //     //         this._userData = userData;
    //     //         this._username = username;
    //     //         this._isAuthenticated = true;
    //     //     }
    //     //     else {
    //     //         // It didn't work. Just remove this data; don't let other things try any longer.
    //     //         localStorage.removeItem(UserDataAuth.tempAuthStorageIndex);
    //     //         localStorage.removeItem(UserDataAuth.usernameStorageIndex);
    //     //     }
    //     // }

    //     return response.UserValid;
    // }


    /**
     * 
     */
    public async CreateAccount(email: string, password: string, passwordDupe: string): Promise<CreateUserResponse> {
        var createResponse: CreateUserResponse = {
            DidCreate: false,
            Errors: []
        };

        var passwordHash: string = BCrypt.hashSync(password, this.salt);
        var passwordsMatch: boolean = BCrypt.compareSync(passwordDupe, passwordHash);

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

    public async CheckForAccess(): Promise<boolean> {
        if (this._authState === "Checking") {
            await new Promise<void>((resolve, reject) => {
                // Reject the promise if we wait > 5 seconds before getting a response.
                var timeoutWaiting = setTimeout(() => reject(), 5000);

                firebase.auth().onAuthStateChanged(function(user) {
                    // If we got an answer, don't reject.
                    window.clearTimeout(timeoutWaiting);
                    resolve();
                });
            });
        }

        return this._authState === "Authorized";
    }

    /**
     * 
     */
    public static GetInstance(): UserDataAuth {
        if (!this._instance) {
            this._instance = new UserDataAuth();
        }

        return this._instance;
    }
}
