import * as AWS from 'aws-sdk';
import { LantsPantsUserData } from './LantsPantsUserData';
import * as BCrypt from 'bcryptjs';

interface AuthResponse {
    AuthData: string | undefined;
    UserExists: boolean;
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

    private DynamoDb: AWS.DynamoDB;

    /**
     * 
     * @param username 
     */
    private CheckForExistingUser(username: string): Promise<boolean> {
        var queryItemParams: AWS.DynamoDB.QueryInput = {
            TableName: UserDataAuth.userTableName,
            ExpressionAttributeValues: {
                ':givenUsername': {S: username}
            },
            KeyConditionExpression: 'username = :givenUsername'
        }

        return new Promise<boolean>((resolve, reject) => {
            let userDoesExist: boolean = false;

            this.DynamoDb.query(queryItemParams, function(err, data) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    if (data.Items == undefined) {
                        userDoesExist = false;
                    }
                    else {
                        userDoesExist = true;
                    }
                    resolve(userDoesExist);
                }
            })
        })

        // var getItemParams = {
        //     TableName: UserDataAuth.userTableName,
        //     Key: {
        //         username: { S: username },
        //     }
        // };

        // return new Promise<boolean>((resolve, reject) => {
        //     let userDoesExist: boolean = false;

        //     this.DynamoDb.getItem(getItemParams, function (err, data) {
        //         if (err) {
        //             console.error(err);
        //             reject(data);
        //         } else {
        //             console.log(data);
        //             if (data.Item !== undefined) {
        //                 userDoesExist = true;
        //             }
        //             resolve(userDoesExist);
        //         }
        //     });
        // })
    }

    /**
     * 
     * @param username 
     * @param passwordHash 
     * @param createResponse 
     */
    private CreateUser(username: string, passwordHash: string, createResponse: CreateUserResponse) {
        var putItemParams = {
            TableName: UserDataAuth.userTableName,
            Item: {
                username: { S: username },
                passhash: { S: passwordHash }
            }
        }

        // Try to create a user account.
        var putItemPromise = new Promise<void>((resolve, reject) => {
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

        // The server didn't complain, but let's just try logging in to be sure that nothing went awry.
        putItemPromise.then(() => {
            this.SignInUsingCredentials(username, passwordHash);
            if (this._isAuthenticated) {
                createResponse.DidCreate = true;
            }
            else {
                createResponse.Errors.push("There was an unexpected error when creating the user. Please try again.");
            }
        });

        putItemPromise.catch(() => {
            createResponse.Errors.push("The server was very unhappy when it got a request to create a user account. You should tell Lance aobut this.");
        });
    }

    /**
     * 
     * @param username 
     * @param passwordHash 
     */
    private SignInUsingCredentials(username: string, passwordHash: string) {
        var getItemParams = {
            TableName: UserDataAuth.userTableName,
            Key: {
                username: { S: username },
                passhash: { S: passwordHash }
            },
            ProjectionExpression: UserDataAuth.userDataIndex
        };

        // var userExists: boolean = false;
        // var serverCachedData: undefined | string = undefined;
        // var getItemPromise: Promise<AuthResponse>;

        // this.DynamoDb.getItem(getItemParams, function (err, data) {
        //     if (err) {
        //         console.error("There was an error getting the user's data.", data);
        //     } else {
        //         if (data.Item !== undefined) {
        //             console.log("User exists. Getting data from response.");
        //             userExists = true;
        //             if (data.Item.userdata !== undefined) {
        //                 serverCachedData = data.Item.userdata.S as string;
        //             }
        //         }
        //     }
        // });

        var getItemPromise = new Promise<AuthResponse>((resolve, reject) =>  {
            let serverCachedData: undefined | string = undefined;
            let userDoesExist: boolean = false;

            this.DynamoDb.getItem(getItemParams, function (err, data) {
                if (err) {
                    console.error(err);
                    reject(data);
                } else {
                    console.log(data);
                    if (data.Item !== undefined) {
                        userDoesExist = true;
                        if (data.Item.userdata !== undefined) {
                            serverCachedData = data.Item.userdata.S as string;
                        }
                    }
                    resolve({AuthData: serverCachedData, UserExists: userDoesExist});
                }
            });
        })

        getItemPromise.then(value => {
            if (value.UserExists) {
                this._isAuthenticated = true;

                // Save those credentials to local storage. This should help persist the last
                // logged-in user between visits.
                localStorage.setItem(UserDataAuth.usernameIndex, username);
                localStorage.setItem(UserDataAuth.passHashIndex, passwordHash);

                let userData: LantsPantsUserData = new LantsPantsUserData();

                // If the response contained auth data, that means that this person has something
                // saved. Update what their user data should be.
                if (value.AuthData !== undefined) {
                    var parsedJson = JSON.parse(value.AuthData);
                    Object.assign(userData, parsedJson);
                }

                this._userData = userData;
            }
        });

        getItemPromise.catch(value => {
            console.error("There was an error getting the user's data", value)
        });
        
        // if (userExists) {
        //     let userData: LantsPantsUserData = new LantsPantsUserData();
            
        //     if (serverCachedData !== undefined) {
        //         var parsedJson = JSON.parse(serverCachedData);
        //         Object.assign(userData, parsedJson)
        //     }
            
        //     this._userData = userData;
        //     this._isAuthenticated = true;

        //     // Save those credentials to local storage. This should help persist the last
        //     // logged-in user between visits.
        //     localStorage.setItem(UserDataAuth.usernameIndex, username);
        //     localStorage.setItem(UserDataAuth.passHashIndex, passwordHash);
        // }
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

        // AWS.config.update({
        //     // region: 'us-east-2',
        //     accessKeyId: process.env.REACT_APP_DYNAMO_KEY,
        //     secretAccessKey: process.env.REACT_APP_DYNAMODB_SECRET_KEY
        // })

        var username: string | null = localStorage.getItem(UserDataAuth.usernameIndex);
        var passhash: string | null = localStorage.getItem(UserDataAuth.passHashIndex);

        if (username !== null && passhash !== null) {
            this.SignInUsingCredentials(username, passhash);
        }
    }

    /**
     * 
     * @param username 
     * @param password 
     */
    public Login(username: string, password: string): void {
        var passwordHash: string = BCrypt.hashSync(password, UserDataAuth.saltRounds);
        this.SignInUsingCredentials(username, passwordHash);
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
     */
    public CreateAccount(username: string, password: string, passwordDupe: string): CreateUserResponse {
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

        // Validate that their username of choice hasn't already been taken by someone else.
        var checkForUserPromise = this.CheckForExistingUser(username);
        checkForUserPromise.then(userAlreadyExists => {
            if (userAlreadyExists) {
                createResponse.Errors.push(`The username '${username}' has already been taken :(.`);
            }
        });

        checkForUserPromise.catch(reason => {
            console.log(reason);
            createResponse.Errors.push("The server disliked creating an account. You should tell Lance.");
        })

        if (createResponse.Errors.length === 0) {
            this.CreateUser(username, passwordHash, createResponse);
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
