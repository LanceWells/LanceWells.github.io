import * as AWS from 'aws-sdk';
import { LantsPantsUserData } from './LantsPantsUserData';
import * as BCrypt from 'bcryptjs';

interface AuthResponse {
    AuthData: string | undefined;
    UserValid: boolean;
}

export interface CreateUserResponse {
    DidCreate: boolean;
    Errors: string[];
}

export class UserDataAuth {
    private static _instance: UserDataAuth;

    private _isAuthenticated: boolean;

    private static readonly usernameIndex: string = "username";
    private static readonly passHashIndex: string = "passhash";
    private static readonly userDataIndex: string = "userdata";
    private static readonly userTableName: string = "LantsPants.UserStorage";

    private static readonly saltRounds: number = 10;

    // private _username: string | null;
    // private _passwordHash: string | null;
    private _userData: LantsPantsUserData | undefined;

    private _username: string = "";

    private DynamoDb: AWS.DynamoDB;

    /**
     * 
     * @param username 
     */
    private async CheckForExistingUser(username: string): Promise<boolean> {
        var userExists: boolean = true;

        var queryItemParams: AWS.DynamoDB.QueryInput = {
            TableName: UserDataAuth.userTableName,
            ExpressionAttributeValues: {
                ':givenUsername': {S: username}
            },
            KeyConditionExpression: 'username = :givenUsername'
        }

        var queryPromise = this.DynamoDb.query(queryItemParams).promise();

        await queryPromise.then(
            onResolve => {
                console.log("CheckForUserResults", onResolve);
                if (onResolve.Items === undefined || onResolve.Count === undefined || onResolve.Count !== 0) {
                    userExists = true;
                }
                else {
                    userExists = false;
                }
            }, onReject => {
                console.error("Failed DB check for existing user.");
            }
        )

        return userExists;

        // return new Promise<boolean>((resolve, reject) => {
        //     let userDoesExist: boolean = true;

        //     this.DynamoDb.query(queryItemParams, function(err, data) {
        //         if (err) {
        //             console.error(err);
        //             reject(err);
        //         } else {
        //             if (data.Items == undefined) {
        //                 userDoesExist = false;
        //             }
        //             else {
        //                 userDoesExist = true;
        //             }
        //             resolve(userDoesExist);
        //         }
        //     })
        // })
    }

    /**
     * 
     * @param username 
     * @param passwordHash 
     */
    private CreateUser(username: string, passwordHash: string): Promise<void> {
        var putItemParams = {
            TableName: UserDataAuth.userTableName,
            Item: {
                username: { S: username },
                passhash: { S: passwordHash }
            }
        }

        // Try to create a user account.
        return new Promise<void>((resolve, reject) => {
            this.DynamoDb.putItem(putItemParams, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(data);
                } else {
                    console.log(data);
                    resolve();
                }
            })
        })
    }

    /**
     * 
     * @param username 
     * @param passwordHash 
     */
    private async SignInUsingCredentials(username: string, password: string): Promise<AuthResponse> {
        var authResponse: AuthResponse = {
            AuthData: "",
            UserValid: false
        };

        var queryItemParams: AWS.DynamoDB.QueryInput = {
            TableName: UserDataAuth.userTableName,
            ExpressionAttributeValues: {
                ':givenUsername': { S: username }
            },
            KeyConditionExpression: 'username = :givenUsername',
        }

        var queryResult = await this.DynamoDb.query(queryItemParams).promise();
        if (    queryResult !== undefined
             && queryResult.Count !== undefined
             && queryResult.Count === 1
             && queryResult.Items !== undefined) {

            var userPassHash = queryResult.Items[0].passhash.S as string;
            var passwordMatchesHash = BCrypt.compareSync(password, userPassHash);

            if (passwordMatchesHash) {
                var userData: string | undefined = undefined;
                var userDataAttribute = queryResult.Items[0].userdata;

                if (userDataAttribute !== undefined) {
                    userData = queryResult.Items[0].userdata.S as string | undefined;
                }

                authResponse = {
                    AuthData: userData,
                    UserValid: true
                }
            }
        }

        return authResponse;
    }

    /**
     * 
     */
    public get IsAuthenticated(): boolean {
        return this._isAuthenticated;
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
        this._isAuthenticated = false;
        this._userData = undefined;

        this.DynamoDb = new AWS.DynamoDB({
            region: 'us-east-2',
            accessKeyId: process.env.REACT_APP_DYNAMO_KEY,
            secretAccessKey: process.env.REACT_APP_DYNAMODB_SECRET_KEY
        });

        // var username: string | null = localStorage.getItem(UserDataAuth.usernameIndex);
        // var passhash: string | null = localStorage.getItem(UserDataAuth.passHashIndex);

        // if (username !== null && passhash !== null) {
        //     this.SignInUsingCredentials(username, passhash);
        // }
    }

    /**
     * 
     */
    public Logout(): void {
        // Set auth to false
        this._isAuthenticated = false;

        // Delete local credentials
        localStorage.removeItem(UserDataAuth.usernameIndex);
        localStorage.removeItem(UserDataAuth.passHashIndex);
    }


    /**
     * 
     * @param username 
     * @param password 
     */
    public async Login(username: string, password: string): Promise<boolean> {
        var response: AuthResponse = await this.SignInUsingCredentials(username, password);

        if (response.UserValid) {
            // // Save those credentials to local storage. This should help persist the last
            // // logged-in user between visits.
            // localStorage.setItem(UserDataAuth.usernameIndex, username);
            // localStorage.setItem(UserDataAuth.passHashIndex, passwordHash);

            let userData: LantsPantsUserData = new LantsPantsUserData();

            // If the response contained auth data, that means that this person has something
            // saved. Update what their user data should be.
            if (response.AuthData !== undefined) {
                var parsedJson = JSON.parse(response.AuthData);
                Object.assign(userData, parsedJson);
            }

            this._userData = userData;
            this._username = username;
            this._isAuthenticated = true;
        }

        return response.UserValid;
    }

    // public async LoginUsingStoredCredentials(): Promise<boolean> {
    //     var username: string | null = localStorage.getItem(UserDataAuth.usernameIndex);
    //     var passhash: string | null = localStorage.getItem(UserDataAuth.passHashIndex);

    //     var didLogin: boolean = false;
    //     if (username && passhash) {
    //         didLogin = await this.Login(username, passhash);
    //     }

    //     return didLogin;
    // }


    /**
     * 
     */
    public async CreateAccount(username: string, password: string, passwordDupe: string): Promise<CreateUserResponse> {
        var createResponse: CreateUserResponse = {
            DidCreate: false,
            Errors: []
        };

        var passwordHash: string = BCrypt.hashSync(password, UserDataAuth.saltRounds);
        var passwordsMatch: boolean = BCrypt.compareSync(passwordDupe, passwordHash);

        // Validate that the passwords match.
        if (!passwordsMatch) {
            createResponse.Errors.push("Your passwords did not match.");
        }

        var userAlreadyExists: boolean = await this.CheckForExistingUser(username);
        if (userAlreadyExists) {
            createResponse.Errors.push(`The username '${username}' has already been taken :(.`);
        }

        if (createResponse.Errors.length === 0) {
            await this.CreateUser(username, passwordHash);

            var didLogin: boolean = await this.Login(username, passwordHash);
            createResponse.DidCreate = didLogin;
        }

        if (!createResponse.DidCreate) {
            createResponse.Errors.push("There was a problem when creating this account. Please try again.");
        }

        return createResponse;
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
