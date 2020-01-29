import { LantsPantsUserData } from './LantsPantsUserData';
import * as BCrypt from 'bcryptjs';
import firebase from 'firebase';
import { CharacterData } from '../../Items/Interfaces/CharacterData';
import { IUserProfile } from '../../GamePage/Interfaces/IUserProfile';
import { ProfileIsPlayer, IPlayerProfile } from '../../GamePage/Interfaces/IPlayerProfile';
import { ProfileIsDM, IDMProfile } from '../../GamePage/Interfaces/IDMProfile';
import { TUserProfileType } from '../../GamePage/Types/TUserProfileType';

export interface LoginResponse {
    DidLogin: boolean;
    Errors: string[];
}

export interface CreateProfileResponse {
    DidCreate: boolean;
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
    private static readonly collection_Profiles = "profiles";
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
     * 
     * @param user 
     */
    private HandleAuthStateChanged(user: firebase.User | null): void {
        if (user) {
            UserDataAuth.GetInstance()._authState = "Authorized";
            console.log("User " + user.uid + " has logged in.")

            UserDataAuth.GetInstance().InitializeAfterAuth();
        }
        else {
            // This means that either the auth has initialized, or that someone has logged out.
            UserDataAuth.GetInstance()._authState = "Unauthorized";
            console.log("User has logged out.")

            UserDataAuth.GetInstance().UnsubscribeSnapshotListener();
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

        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .catch(function (error) {
                var errorMessage = error.message;
                console.error(errorMessage);
                loginResponse.Errors.push(errorMessage);
            });
        
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (credentials: firebase.auth.UserCredential) {
                loginResponse.DidLogin = true;
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
     * Gets the singleton instance of this object.
     */
    public static GetInstance(): UserDataAuth {
        if (!this._instance) {
            this._instance = new UserDataAuth();
        }

        return this._instance;
    }

    /**
     * Creates a new user profile to store in the database. Will not add a profile if one already exists
     * that uses the same name.
     * @param profile The new profile to create and store in the database.
     */
    public async CreateNewProfile(profile: IUserProfile): Promise<CreateProfileResponse> {
        var response: CreateProfileResponse = {
            DidCreate: false,
            Errors: []
        };

        var profiles = await this.FetchProfileList();

        // The new profile name isn't already in our saved list. It's safe to add!
        if (profiles === undefined || !profiles.some(p => p === profile.ProfileName)) {
            if (profiles === undefined) {
                profiles = [];
            }

            profiles.push(profile.ProfileName);

            var updateProfileList = this.UpdateProfileList(profiles);
            var setProfileData = this.SetProfileData(profile);

            response.DidCreate = true;

            await updateProfileList;
            await setProfileData;
        }
        else {
            var errorMessage: string = "User profile " + profile.ProfileName + " already exists."
            response.Errors.push(errorMessage);
            console.error(errorMessage);
        }

        return response;
    }

    /**
     * Updates the list of profiles stored on the server. Should only be called when adding or removing
     * any given profile. Using a list that is separate from all of the documents should save over
     * querying every user profile in both data transmission as well as the number of reads to the
     * database. The unfortunate side-effect is that we have to double the number of places data is
     * stored for user profile names.
     * 
     * @param profiles The list of profiles to use as the new profile list.
     */
    private async UpdateProfileList(profiles: string[]): Promise<void> {
        var uid = this.GetUid();

        await firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .update({
                profileList: profiles
            })
            .then(() => {
                console.log("Successfully updated profile list.");
            })
            .catch(reason => {
                console.error("Failed to update profile list. " + reason);
            });
    }

    /**
     * Gets the list of profiles for this user.
     */
    public async FetchProfileList(): Promise<string[] | undefined> {
        var uid = this.GetUid();

        var docSnapshot = await firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .get();

        var profiles: string[] | undefined = undefined;

        if (docSnapshot.exists) {
            var docData = docSnapshot.data();
            if (docData !== undefined) {
                var serverProfiles: string[] | undefined = docData.profileList;
                if (serverProfiles !== undefined) {
                    profiles = serverProfiles;
                }
            }
        }

        return profiles;
    }

    /**
     * Sets (creates/updates) the profoile information for a given user.
     * @param profile The profile to set for a given user.
     */
    public async SetProfileData(profile: IUserProfile): Promise<void> {
        var uid = this.GetUid();
        
        // Just use some generic data at first. Any specific roles with extra stuff are fine to be
        // initialized as empty.
        var docData: firebase.firestore.DocumentData = {
            ProfileType: profile.ProfileType,
            GameId: profile.GameID,
            ProfileImage: profile.ProfileImage,
        }
        
        // When specific profiles have specific fields, use those instead.
        if (ProfileIsPlayer(profile)) {
            docData = {
                ProfileType: profile.ProfileType,
                GameId: profile.GameID,
                ProfileImage: profile.ProfileImage,
                CharData: profile.CharData.Serialize()
            }
        }
        
        await firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .collection(UserDataAuth.collection_Profiles)
            .doc(profile.ProfileName)
            .set(docData);
    }

    /**
     * Fetches the profile data for the given profile name for the current user.
     * @param profileName The name of the profile to fetch.
     */
    public async FetchProfileData(profileName: string): Promise<IUserProfile | undefined> {
        var uid = this.GetUid();

        var docSnapshot = await firebase
            .firestore()
            .collection(UserDataAuth.collection_UserWritable)
            .doc(uid)
            .collection(UserDataAuth.collection_Profiles)
            .doc(profileName)
            .get();

        var userProfile: IUserProfile | undefined = undefined;
        if (docSnapshot.exists) {
            var docData = docSnapshot.data();
            if (docData !== undefined) {
                // It's not great to just go through one-by-one to get each field name. If we end up
                // with more fields, or unique fields, this can become a problem. TODO: Get a better
                // option for this behavior.

                // Regular fields. These NEED to be included.
                var gameId: string | null | undefined = docData.GameId;
                var profileImage: string | undefined = docData.ProfileImage;
                var profileType: TUserProfileType | undefined = docData.ProfileType;

                // Character-specific fields. These only need to be included for character profiles.
                var charData: string | undefined = docData.CharData;

                if (gameId !== undefined && profileImage !== undefined && profileType !== undefined) {

                    // Go through every profile type, and verify that they have the data they need. If
                    // they have it, go ahead and create the profile we'll return.
                    switch(profileType) {
                        case "Player" : {
                            if (charData !== undefined) {
                                var playerProfile: IPlayerProfile = {
                                    ProfileType: "Player",
                                    ProfileImage: profileImage,
                                    ProfileName: profileName,
                                    GameID: gameId,
                                    CharData: CharacterData.DeSerialize(charData)
                                };

                                userProfile = playerProfile;
                            }
                        }
                        break;
                        case "DM" : {
                            var dmProfile: IDMProfile = {
                                ProfileType: "DM",
                                ProfileImage: profileImage,
                                ProfileName: profileName,
                                GameID: gameId
                            }

                            userProfile = dmProfile;
                        }
                        break;
                        default: {}
                    }
                }
            }
        }

        return userProfile;
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

    private onUserDataChanged_listeners: ((userdata: CharacterData[]) => void)[] = [];

    private onUserDataChanged_notify(userData: CharacterData[]) {
        this.onUserDataChanged_listeners.forEach(e => e(userData));
    }

    public onUserDataChanged(e: (userdata: CharacterData[]) => void) {
        this.onUserDataChanged_listeners.push(e);
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
                if (serializedData) {
                    charData = serializedData.map(s => CharacterData.DeSerialize(s));
                }
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

        var email = firebase.auth().currentUser?.email;
        if (email && email !== undefined) {
            this._username = email;
        }
    }

    private UnsubscribeSnapshotListener(): void {
        // Calling this listener will unsubscribe from this event.
        this._snapshotListener();
    }
}
