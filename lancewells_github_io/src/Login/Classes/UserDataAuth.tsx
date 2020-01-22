import { LantsPantsUserData } from './LantsPantsUserData';
import * as BCrypt from 'bcryptjs';
import firebase from 'firebase';
import { CharacterData } from '../../Items/Interfaces/CharacterData';

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

    /**
     * Describes the current authorization state for user authorization.
     */
    private _authState: TAuthState;

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

    /**
     * The maximum length of allowed passwords.
     */
    public static readonly MaxPasswordLength = 60;
    private static readonly collection_UserWritable = "userWritable";
    private _snapshotListener: () => void = () => {};

    /**
     * Gets the current authorization state for user authorization.
     */
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
     * Creates a new instance of this object.
     */
    private constructor() {
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
        firebase.auth().onAuthStateChanged(this.HandleAuthStateChanged);
    }

    private GetUid(): string | undefined {
        var uid = firebase.auth().currentUser?.uid;
        if (!uid) {
            uid = undefined;
        }
        return uid;
    }


    /**
     * Deserialize the data snapshot that is returned form the firestore.
     */
    private DeserializeCharData(docSnapshot: firebase.firestore.DocumentSnapshot): CharacterData[] {
        var charData: CharacterData[] = [];

        if (docSnapshot.exists) {
            var docData = docSnapshot.data();
            if (docData !== undefined) {
                var serializedData: string[] = docData.characterData;
                charData = serializedData.map(s => CharacterData.DeSerialize(s));
            }
        }

        return charData;
    }

    private InitializeAfterAuth(): void {
        var uid = this.GetUid();

        // Add a listener for specific documents that change on the remote.
        // https://firebase.google.com/docs/firestore/query-data/listen
        firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
                var charData: CharacterData[] = this.DeserializeCharData(doc);
                console.log("Snapshot data: " + charData);
                this.onUserDataChanged_notify(charData);
            });
    }

    /**
     * 
     * @param user 
     */
    private HandleAuthStateChanged(user: firebase.User | null): void {
        if (user) {
            UserDataAuth.GetInstance()._authState = "Authorized";
            console.log("User " + user.uid + " has logged in.")

            UserDataAuth.GetInstance().InitializeAfterAuth();


            // var uid = user.uid;
            
            // // Add a listener for specific documents that change on the remote.
            // // https://firebase.google.com/docs/firestore/query-data/listen
            // firebase
            //     .firestore()
            //     .collection(UserDataAuth.collection_UserWritable)
            //     .doc(uid)
            //     .onSnapshot(function(doc) {
            //         console.log("Doc data snapshot:" + doc.data());
            //     })

            // // Add a listener for specific documents that change on the remote.
            // // https://firebase.google.com/docs/firestore/query-data/listen
            // firebase
            //     .firestore()
            //     .collection(UserDataAuth.collection_UserWritable)
            //     .doc(uid)
            //     .onSnapshot(function (doc) => {
            //         console.log("Received data from the server.");
            //         var charData = this.DeserializeCharData(doc);
            //         console.log("Data received: " + charData);
            //         this.onUserDataChanged_notify(charData);
            //     });
        }
        else {
            // This means that either the auth has initialized, or that someone has logged out.
            UserDataAuth.GetInstance()._authState = "Unauthorized";
            console.log("User has logged out.")

            // Calling this listener will unsubscribe from this event.
            this._snapshotListener();
        }
    }

    /**
     * Logs out from any current user instances.
     */
    public Logout(): void {
        firebase.auth().signOut();
    }

    /**
     * Logs into a user instance using an email-password combination.
     * @param email The email of the user to login.
     * @param password The password of the user to login.
     */
    public async Login(email: string, password: string): Promise<LoginResponse> {
        var loginResponse: LoginResponse = {
            DidLogin: false,
            Errors: []
        };

        var username: string | null | undefined = null;

        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .catch(function (error) {
                var errorMessage = error.message;
                console.error(errorMessage);
                loginResponse.Errors.push(errorMessage);
            });
        
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (credentials: firebase.auth.UserCredential) {
                loginResponse.DidLogin = true;
                username = credentials.additionalUserInfo?.username;
            })
            .catch(function (error) {
                var errorMessage = error.message;
                console.error(errorMessage);
                loginResponse.Errors.push(errorMessage);
            });
        
        return loginResponse;
    }

    /**
     * Creates a new user asynchronously.
     * @param email The email of the new user to create.
     * @param password The password for the new user.
     * @param passwordDupe A duplicate of the password that the user has provided.
     */
    public async CreateAccount(email: string, password: string, passwordDupe: string): Promise<CreateUserResponse> {
        var createResponse: CreateUserResponse = {
            DidCreate: false,
            Errors: []
        };

        // This may be a little overkill, but don't compare plaintext passwords, use something more robust
        // like BCrypt to compare.
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

    /**
     * Checks for access being granted to the user.
     */
    public async CheckForAccess(): Promise<boolean> {
        if (this._authState === "Checking") {
            await new Promise<void>((resolve, reject) => {
                // Reject the promise if we wait > X seconds before getting a response.
                var timeoutWaiting = setTimeout(() => reject(), 10000);

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
     * Updates the backend with the character data that we need to update.
     */
    public async UpdateCharacterData(charData: CharacterData[]): Promise<void> {
        var uid = this.GetUid();
        var serializedData: string[] = charData.map(i => i.Serialize());

        return firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .set({
                characterData: serializedData
            }).then(resolved => {
                console.log("Successfully wrote character data.\n" + serializedData);
            }).catch(reason => {
                console.error("Failed to write character data.\n" + reason);
            });
    }

    /**
     * Fetches new character data from the backend.
     */
    public async FetchCharacterData(): Promise<CharacterData[]> {
        var uid = this.GetUid();

        var docSnapshot = await firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .get();

        var charData = this.DeserializeCharData(docSnapshot);

        return charData;
    }

    /**
     * Gets the singleton instance of this object.
     */
    public static GetInstance(): UserDataAuth {
        if (!this._instance) {
            this._instance = new UserDataAuth();
        }

        return this._instance;
    }

    private onUserDataChanged_listeners: ((userdata: CharacterData[]) => void)[] = [];

    private onUserDataChanged_notify(userData: CharacterData[]) {
        this.onUserDataChanged_listeners.forEach(e => e(userData));
    }

    public onUserDataChanged(e: (userdata: CharacterData[]) => void) {
        this.onUserDataChanged_listeners.push(e);
    }
}
