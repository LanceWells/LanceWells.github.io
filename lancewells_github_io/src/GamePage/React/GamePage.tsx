import React from 'react';
import { TUserProfileType } from '../Types/TUserProfileType';
import { IUserProfile } from '../Interfaces/IUserProfile';
import { UserDataAuth } from '../../Login/Classes/UserDataAuth';

interface IGamePageProps {
}

interface IGamePageState {
    _profileType: TUserProfileType;
    _userProfiles: string[];
    _currentProfile: IUserProfile | undefined;
}

export class GamePage extends React.Component<IGamePageProps, IGamePageState> {
    private readonly storage_lastChosenProfile: string = "LastChosenProfile";

    /**
     * Switches to a different profile based on the name. Switches to "Error" state if this fails.
     * @param profileName The name of the profile to switch to.
     */
    private SwitchToProfile(profileName: string): boolean {
        var didSwitch: boolean = false;

        UserDataAuth.GetInstance().FetchProfileData(profileName)
            .then(profile => {
                if (profile !== undefined) {
                    this.setState({
                        _currentProfile: profile,
                        _profileType: profile.ProfileType
                    });

                    // If we were successful when looking up this profile, then it's valid and we should save
                    // it for the next login.
                    localStorage.setItem(this.storage_lastChosenProfile, profileName);
                    didSwitch = true;
                }
            })
            .catch(reason => {
                console.error("Failed to lookup profile info." + reason);
            });

        return didSwitch;
    }

    /**
     * Loads up all available profiles and signs into the first valid one.
     */
    private async LoadProfiles(): Promise<void> {
        // First, spin off a task to get the list of available user profiles.
        var availableProfilesPromise = UserDataAuth.GetInstance().FetchProfileList();

        // In the meantime, check and see if we have a last chosen profile that we can use.
        var lastChosenProfile = localStorage.getItem(this.storage_lastChosenProfile);
        var lastChosenIsValid: boolean = false;

        if (lastChosenProfile) {
            lastChosenIsValid = this.SwitchToProfile(lastChosenProfile);
        }

        var availableProfiles = await availableProfilesPromise;
        if (availableProfiles !== undefined) {
            this.setState({
                _userProfiles: availableProfiles
            });
        }

        // If the last chosen wasn't valid (or didn't exist) and we have other profiles that we can try, try
        // them.
        if (!lastChosenIsValid && (availableProfiles !== undefined && availableProfiles.length > 0)) {

            // Try to use the first item in the list that we got back from our lookup instead.
            var firstProfile: string = availableProfiles[0];
            var firstProfileIsValid: boolean = this.SwitchToProfile(firstProfile);

            // That's not good. Neither the last chosen profile nor the first one in the list is valid. For now,
            // just give the user an error message and let Lance figure out their data on the backend.
            // TODO: make this try every profile instead of just the first.
            if (!lastChosenIsValid && !firstProfileIsValid) {
                this.setState({
                    _profileType: "Error"
                });
            }
        }
        // The user didn't have any available profiles to pick from, that means that they haven't used this
        // site yet under this login (or that their data has DISAPPEARED).
        else if (availableProfiles === undefined || availableProfiles.length <= 0) {
            this.setState({
                _profileType: "None"
            })
        }
    }

    /**
     * Renders the tabulated component that depends on 
     */
    private RenderTabComponent(): JSX.Element {
        switch (this.state._profileType) {
            case "Player": return this.RenderPlayerProfile();
            case "DM": return this.RenderDMProfile();
            case "None": return this.RenderNoProfile();
            default: return this.RenderNoProfile();
        }
    }

    /**
     * Returns a visual component for when the user is actively using a player profile.
     */
    private RenderPlayerProfile(): JSX.Element {
        return (
            <div>
            </div>
        )
    }

    /**
     * Returns a visual component for when the user is actively using a DM profile.
     */
    private RenderDMProfile(): JSX.Element {
        return (
            <div>
            </div>
        )
    }

    /**
     * Returns a visual component for when the user has not yet created a profile.
     */
    private RenderNoProfile(): JSX.Element {
        return (
            <div>
                <h2>It looks like you don't have a profile setup yet. Press this button to make one.</h2>
            </div>
        )
    }

    /**
     * Creates a new instance of this class.
     * @param props A set of properties that are passed-in at creation and monitored for changes.
     */
    public constructor(props: IGamePageProps) {
        super(props);
        this.state = {
            _profileType: "None",
            _userProfiles: [],
            _currentProfile: undefined
        };
    }

    /**
     * Returns the render-able output from this class.
     */
    public render() {
        return(
            <div className="game">
                <div className="game-usertab-container">
                    {this.RenderTabComponent()}
                </div>
                <div className="game-chat-container">
                </div>
            </div>
        )
    }

    /**
     * Handles when this component has successfully mounted (loaded).
     */
    public componentDidMount() {
        this.LoadProfiles();
    }
}
