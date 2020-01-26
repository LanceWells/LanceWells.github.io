import { IUserProfile } from "./IUserProfile";

export type TProfileChangeListener = (newProfile: IUserProfile) => void;

// only an interface for now so that it's easier to define what the end result will look like.
export interface IProfileState {
    // Gets the active profile so that stateful objects can represent what the user is acting under.
    // public
    GetActiveProfile(): IUserProfile | null;

    // Used to handle changing the entire user profile. Should also be called after adding a new profile.
    // Should just make a call to GET the relevant profile, and notify listeners once we've gotten it.
    // public
    ChangeProfile(newProfile: IUserProfile): void;

    // Used to handle updating the current profile. May be the same as changing a profile?
    // Applies a new change to the active profile. Should SET the new profile details for a user.
    // public
    UpdateProfile(updatedProfile: IUserProfile): void;

    // Creates a new profile and SETs it in the firebase backend. Callers here can determine whether
    // to use ChangeProfile() afterwards or not.
    // public
    AddProfile(newProfile: IUserProfile): void;

    // Adds a new listener for profile change events.
    // public
    OnProfileChange(newListener: TProfileChangeListener): void;

    // Gets the singleton instance of this class.
    GetInstance(): IProfileState;
}
