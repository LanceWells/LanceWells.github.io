import './GamePage.css';
import React from 'react';
import { TUserProfileType } from '../Types/TUserProfileType';
import { IUserProfile } from '../Interfaces/IUserProfile';
import { UserDataAuth } from '../../Login/Classes/UserDataAuth';
import { ProfileCreation, Callback_CreationFinished } from './ProfileCreation';
import { GameTab } from './GameTab';
import { GameTabContainer } from './GameTabContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Inventory } from '../../Items/React/Inventory/Inventory';
import { ItemShop } from '../../Items/React/Shop/ItemShop';

interface IGamePageProps {
}

interface IGamePageState {
    // _pageDisplay: TDisplayStatus;
    // _profileType: TUserProfileType;
    _userProfiles: string[];
    _currentProfile: IUserProfile | undefined;
    _gameTabs: GameTab[];
}

// type TDisplayStatus = TUserProfileType | "GettingInfo" | "Error" | "NewProfile";

export class GamePage extends React.Component<IGamePageProps, IGamePageState> {
    private readonly storage_lastChosenProfile: string = "LastChosenProfile";

    /**
     * Gets the tabs that will be displayed to a player by default. These tabs should never be removed unless
     * the user is switching profiles.
     */
    private GetDefaultPlayerTabs(): GameTab[] {
        var testTab: GameTab = new GameTab({
            tabName: "Test Player Tab",
            tabIndex: "0",
            wrappedComponent: (
                <h1>Using this page as player {this.state._currentProfile?.ProfileName}.</h1>
        )});

        var anotherTestTab: GameTab = new GameTab({
            tabName: "Another Player Tab",
            tabIndex: "1",
            wrappedComponent: (
            <h2>Here's another player tab!</h2>
        )});

        var inventoryTab: GameTab = new GameTab({
            tabName: "Inventory Tab",
            tabIndex: "2",
            wrappedComponent: (
                <Inventory />
        )});

        var shopTab: GameTab = new GameTab({
            tabName: "Item Shop",
            tabIndex: "3",
            wrappedComponent: (
                <ItemShop />
            )
        });

        // TODO: Stat Page tab.
        // TODO: Inventory tab.

        var tabs: GameTab[] = [];
        tabs.push(testTab);
        tabs.push(anotherTestTab);
        tabs.push(inventoryTab);
        tabs.push(shopTab);
        return tabs;
    }

    /**
     * Gets the tab that will be displayed to a DM by default. These tabs should never be removed unless the
     * user is switching profiles.
     */
    private GetDefaultDMTabs(): GameTab[] {
        var testTab: GameTab = new GameTab({
            tabName: "Test DM Tab",
            tabIndex: "0",
            wrappedComponent: (
            <h1>Using this page as DM {this.state._currentProfile?.ProfileName}.</h1>
        )});

        // TODO: DM Screen.

        var tabs: GameTab[] = [];
        tabs.push(testTab);
        return tabs;
    }

    /**
     * Gets the tabs that will be displayed when a user has yet to create any profiles.
     */
    private GetNoProfileTabs(): GameTab[] {
        var handleFinishedCreation: Callback_CreationFinished = (profile: IUserProfile) => {
            this.SwitchToProfile(profile.ProfileName);
            // this.setState({
            //     // _profileType: profile.ProfileType
            // });
        }

        var noProfileTab: GameTab = new GameTab({
            tabName: "New Profile",
            tabIndex: "0",
            wrappedComponent: (
            <ProfileCreation
                OnCreationFinished={handleFinishedCreation}
            />
        )});

        var tabs: GameTab[] = [];
        tabs.push(noProfileTab);
        return tabs;
    }

    /**
     * Gets the tabs that will be displayed when there was a terrible, awful, no-good, very-bad error!
     */
    private GetErrorMessageTabs(): GameTab[] {
        var errorMessageTab: GameTab = new GameTab({
            tabName: "Error!",
            tabIndex: "0",
            wrappedComponent: (
            <div>
                <h2>There was a terrible error! You should tell Lance that this happened and how you got here.</h2>
            </div>
        )});

        var tabs: GameTab[] = [];
        tabs.push(errorMessageTab);
        return tabs;
    }

    /**
     * Switches to a different profile based on the name. Switches to "Error" state if this fails.
     * @param profileName The name of the profile to switch to.
     */
    private async SwitchToProfile(profileName: string): Promise<boolean> {
        var didSwitch: boolean = false;

        var profile = await UserDataAuth.GetInstance().FetchProfileData(profileName);
        if (profile !== undefined) {
            this.setState({
                _currentProfile: profile,
                // _profileType: profile.ProfileType
            })
            
            localStorage.setItem(this.storage_lastChosenProfile, profileName);

            switch(profile.ProfileType) {
                case "Player": {
                    this.setState({
                        _gameTabs: this.GetDefaultPlayerTabs()
                    });
                    break;
                }
                case "DM": {
                    this.setState({
                        _gameTabs: this.GetDefaultDMTabs()
                    });
                    break;
                }
                default: {
                    this.setState({
                        _gameTabs: this.GetErrorMessageTabs()
                    });
                    break;
                }
            }

            didSwitch = true;
        }

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
            lastChosenIsValid = await this.SwitchToProfile(lastChosenProfile);
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

            for (let i = 0; i < availableProfiles.length; i++) {
                // Try to use the nth item in the list that we got back from our lookup instead.
                var profile: string = availableProfiles[i];
                var profileIsValid: boolean = await this.SwitchToProfile(profile);

                // That's not good. Neither the last chosen profile nor the first one in the list is valid. For now,
                // just give the user an error message and let Lance figure out their data on the backend.
                // TODO: make this try every profile instead of just the first.
                if (!lastChosenIsValid && !profileIsValid) {
                    this.setState({
                        _gameTabs: this.GetErrorMessageTabs()
                    });
                }
            }

        }
        // The user didn't have any available profiles to pick from, that means that they haven't used this
        // site yet under this login (or that their data has DISAPPEARED).
        else if (availableProfiles === undefined || availableProfiles.length <= 0) {
            this.setState({
                // _profileType: "None",
                _gameTabs: this.GetNoProfileTabs()
            })
        }
    }

    /**
     * Creates a new instance of this class.
     * @param props A set of properties that are passed-in at creation and monitored for changes.
     */
    public constructor(props: IGamePageProps) {
        super(props);
        this.state = {
            // _profileType: "None",
            // _pageDisplay: "GettingInfo",
            _userProfiles: [],
            _currentProfile: undefined,
            _gameTabs: []
        };
    }

    /**
     * Returns the render-able output from this class.
     */
    public render() {
        return(
            <div className="game">
                <div className="game-play-area">
                    <GameTabContainer
                        tabs={this.state._gameTabs}
                        tabsId="game-tab-container"
                    />
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
