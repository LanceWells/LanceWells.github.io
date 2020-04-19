import './GamePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { IUserProfile } from '../Interfaces/IUserProfile';
import { UserDataAuth } from '../../Login/Classes/UserDataAuth';
import { ProfileCreation, Callback_CreationFinished } from './ProfileCreation';
import { Inventory } from '../../Items/React/Inventory/Inventory';
import { ItemShop } from '../../Items/React/Shop/ItemShop';
import { IItem } from '../../Items/Interfaces/IItem';
import { ProfileIsPlayer, IPlayerProfile } from '../Interfaces/IPlayerProfile';
import { TRemoveClick } from '../../Items/Types/CardButtonCallbackTypes/TRemoveClick';
import { TPurchaseClick } from '../../Items/Types/CardButtonCallbackTypes/TPurchaseClick';
import { Tab, Tabs } from 'react-bootstrap';
import { GameRoomDisplay } from './GameRoomDisplay';
import { IGameRoom } from '../Interfaces/IGameRoom';
import { GameRoomService } from '../Classes/GameRoomService';
import { DMGameRoom, RoomIsDm } from '../Classes/DMGameRoom';
import { PlayerGameRoom } from '../Classes/PlayerGameRoom';
import { ItemShopManager } from './DM Pages/ItemShopManager';
import { TShopTab } from '../Types/TShopTab';

interface IGamePageProps {
}

interface IGamePageState {
    _userProfiles: string[];
    _currentProfile: IUserProfile | undefined;
    _gameRoom: IGameRoom | undefined;
    _gameTabs: Map<string, JSX.Element>;
    _gameRoomErrors: string[];
}

export class GamePage extends React.Component<IGamePageProps, IGamePageState> {
    private readonly storage_lastChosenProfile: string = "LastChosenProfile";

    /**
     * Removes an item from the current character's inventory.
     * @param item The item to remove.
     */
    private HandleRemoveItem(item: IItem): void {
        var serializedItem: string = item.GetEqualityString();
        var playerProfile: IUserProfile | undefined = this.state._currentProfile;

        if (ProfileIsPlayer(playerProfile)) {
            var foundMatch: boolean = false;
            var i = 0;
            for (i = 0; i < playerProfile.CharData.inventory.length; i++) {
                if (playerProfile.CharData.inventory[i].GetEqualityString() === serializedItem) {
                    foundMatch = true;
                    break;
                }
            }

            if (foundMatch) {
                // playerProfile is a reference to the stateful current profile.
                playerProfile.CharData.inventory.splice(i, 1);

                this.UpdateUserTabs();
                UserDataAuth.GetInstance().SetProfileData(playerProfile);
            }
        }
    }

    /**
     * Adds an item to a character's inventory and removes the appropriate gold from that character.
     * @param item The item to purchase.
     */
    private HandlePurchaseItem(item: IItem): void {
        var playerProfile: IUserProfile | undefined = this.state._currentProfile;
        if (ProfileIsPlayer(playerProfile)) {
            // playerProfile is a reference to the stateful current profile.
            playerProfile.CharData.inventory.push(item);

            this.UpdateUserTabs();
            UserDataAuth.GetInstance().SetProfileData(playerProfile);
        }
    }

    /**
     * Handles the creation of a new game room. Uses the user's profile name. This will be the profile
     * name for the DM.
     */
    private HandleCreateRoom(): void {
        if (this.state._currentProfile !== undefined) {
            var roomName: string;
            roomName = this.state._currentProfile.ProfileName;
            
            GameRoomService.MakeGameRoom(roomName)
            .then(resolved => {
                var gameRoom: DMGameRoom | undefined = resolved;

                // Because this is in a then call, technically _currentProfile could become undefined
                // between calling MakeGameRoom and now. The compiler thinks this at least.
                if (gameRoom !== undefined && this.state._currentProfile !== undefined) {

                    // Grab a reference to the profile, update it, and call setState so that this and all
                    // child components update and re-render.
                    var currentProfile = this.state._currentProfile;
                    currentProfile.GameID = gameRoom.RoomId;

                    // Save this game ID to the DB.
                    UserDataAuth.GetInstance().SetProfileData(currentProfile)
                    .then(resolve => {
                        // Set the game room here. It may not be preferable to do that here, since it
                        // means that we're tying in the "say what your game room is" logic with our
                        // "did we set the profile data?" logic. That said, if there's a problem with
                        // saving profile data, we're having an error regardless, and this saves us from
                        // setting the state twice and causing an unnecessary re-render.
                        this.setState({
                            _gameRoom: gameRoom,
                            _currentProfile: currentProfile
                        });
                    })
                    .catch(reason => {
                        console.error("Failed to save updated profile info to the DB." + reason);

                        var roomErrors = this.state._gameRoomErrors;
                        roomErrors.push("There was an error creating the room. Please try again.");
                        this.setState({
                            _gameRoomErrors: roomErrors
                        });
                    });
                }
            })
            .catch(reason => {
                console.error("Failed to create a game room." + reason);

                var roomErrors = this.state._gameRoomErrors;
                roomErrors.push("There was an error creating the room. Please try again.");
                this.setState({
                    _gameRoomErrors: roomErrors
                });
            });
        } else {
            console.error("This.state._currentProfile is undefined when trying to make a new game room.");

            var roomErrors = this.state._gameRoomErrors;
            roomErrors.push("There was an error creating the room. Please try again.");
            this.setState({
                _gameRoomErrors: roomErrors
            });
        }
    }

    /**
     * Handles a request to join a specific room based on the specified room ID.
     * @param roomId The ID of the room to join.
     */
    private HandleJoinRoom(roomId: string): void {
        if (this.state._currentProfile !== undefined) {
            GameRoomService.JoinGameRoom(roomId, this.state._currentProfile.ProfileName)
                .then(resolved => {
                    var gameRoom: PlayerGameRoom | undefined = resolved;
                    if (gameRoom !== undefined && this.state._currentProfile !== undefined) {
                        console.log("Successfully joined room and got information back from the DB.");
                        
                        var currentProfile = this.state._currentProfile;
                        currentProfile.GameID = gameRoom.RoomId;

                        UserDataAuth.GetInstance().SetProfileData(currentProfile)
                            .then(resolved => {
                                this.setState({
                                    _gameRoom: gameRoom,
                                    _currentProfile: currentProfile
                                });
                            })
                            .catch(reason => {
                                console.error("Failed to join a room due to an error when setting profile data for the user." + reason);

                                var roomErrors = this.state._gameRoomErrors;
                                roomErrors.push("There was an error joining the room. Please try again.");
                                this.setState({
                                    _gameRoomErrors: roomErrors
                                });
                            });
                    }
                    else {
                        console.error("While trying to join a room, got back 'undefined'.");

                        var roomErrors = this.state._gameRoomErrors;
                        roomErrors.push("There was an error joining the room. Please verify that the room ID matches what your GM sent you.");
                        this.setState({
                            _gameRoomErrors: roomErrors
                        });
                    }
                })
                .catch(reason => {
                    console.error("Failed to join the room due to a networking issue." + reason);

                    var roomErrors = this.state._gameRoomErrors;
                    roomErrors.push("There was an error joining the room. Please try again.");
                    this.setState({
                        _gameRoomErrors: roomErrors
                    });
                });
        }
    }

    /**
     * Creates the new shop in the DB.
     * @param newShop The new shop to create and store in the DB.
     */
    private HandleCreateNewShop(newShop: TShopTab): void {
        var gameId = this.state._currentProfile?.GameID;
        
        if (gameId !== null && gameId !== undefined) {
            GameRoomService.AddShop(gameId, newShop)
            .then(result => {
                var gameRoom = this.state._gameRoom;
                if (RoomIsDm(gameRoom)) {
                    gameRoom.Shops.push(result);
                    this.UpdateUserTabs();
                }
            })
            .catch(reason => {
                console.error("Failed to create a new shop.\n" + reason);
            });
        }
    }

    private HandleAddShopToPlayer(roomId: string, playerId: string, shop: TShopTab): void {
        GameRoomService.AddShopToPlayer(roomId, playerId, shop.ID)
        .then(result => {
            var gameRoom = this.state._gameRoom;
            console.log("Successfully added shop " + shop.ID + " to player " + playerId + ".");

            if (RoomIsDm(gameRoom)) {
                let playerToAddRoomTo = gameRoom?.PlayerInfo.find(c => c.Character.Uid == playerId);
                playerToAddRoomTo?.ShopTabs.push(shop)
                this.UpdateUserTabs();
            }
        })
        .catch(reason => {
            console.error("Failed to add shop " + shop.ID + " to player " + playerId + ".\n" + reason);
        });
    }

    /**
     * Gets the tabs that will be displayed to a player by default. These tabs should never be removed unless
     * the user is switching profiles.
     */
    private GetDefaultPlayerTabs(): Map<string, JSX.Element> {
        var tabs: Map<string, JSX.Element> = new Map();

        var handleRemoveItem: TRemoveClick = (item: IItem) => {
            this.HandleRemoveItem(item);
        }

        var handlePurchaseItem: TPurchaseClick = (item: IItem) => {
            this.HandlePurchaseItem(item);
        }

        var playerProfile: IUserProfile | undefined = this.state._currentProfile;
        if (ProfileIsPlayer(playerProfile)) {
            // The typeguard here only works so well, after the first if-statement, the intellisense for
            // typescript gets fuzzy. Create a new var here for us to reference instead.
            let profile: IPlayerProfile = playerProfile;

            tabs.set("Inventory", (
                <Inventory
                    userProfile={profile}
                    removeCallback={handleRemoveItem.bind(this)}
                />
            ));
            
            let playerRoom: PlayerGameRoom = this.state._gameRoom as PlayerGameRoom;

            if (playerRoom  && playerRoom !== undefined) {
                playerRoom.Shops.forEach((shop) => {
                    tabs.set(shop.Name + " (Shop)", (
                        <ItemShop
                            items={shop.Items}
                            userProfile={profile}
                            purchaseCallback={handlePurchaseItem.bind(this)}
                        />
                    ));
                });
            }
        }

        // TODO: Stat Page tab.

        return tabs;
    }

    /**
     * Gets the tab that will be displayed to a DM by default. These tabs should never be removed unless the
     * user is switching profiles.
     */
    private GetDefaultDMTabs(): Map<string, JSX.Element> {
        var tabs: Map<string, JSX.Element> = new Map();

        var room: IGameRoom | undefined = this.state._gameRoom;

        if (RoomIsDm(room))
        {
            tabs.set("Item Shops", (
                <ItemShopManager
                    AddShopToPlayerCallback={this.HandleAddShopToPlayer.bind(this)}
                    DmGameRoom={room}
                    AddNewShopCallback={this.HandleCreateNewShop.bind(this)}
                />
            ));
        }

        tabs.set("DM Screen", (
            <h1>Using this page as DM {this.state._currentProfile?.ProfileName}.</h1>
        ));

        // TODO: DM Screen.

        return tabs;
    }

    /**
     * Gets the tabs that will be displayed when a user has yet to create any profiles.
     */
    private GetNoProfileTabs(): Map<string, JSX.Element> {
        var tabs: Map<string, JSX.Element> = new Map();

        var handleFinishedCreation: Callback_CreationFinished = (profile: IUserProfile) => {
            this.SwitchToProfile(profile.ProfileName);
        }

        tabs.set("New Profile", (
            <ProfileCreation
                OnCreationFinished={handleFinishedCreation.bind(this)}
            />
        ))

        return tabs;
    }

    /**
     * Gets the tabs that will be displayed when there was a terrible, awful, no-good, very-bad error!
     */
    private GetErrorMessageTabs(): Map<string, JSX.Element> {
        var tabs: Map<string, JSX.Element> = new Map();

        tabs.set("Error!", (
            <div>
                <h2>There was a terrible error! You should tell Lance that this happened and how you got here.</h2>
            </div>
        ));
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

            var gameRoom: IGameRoom | undefined = this.state._gameRoom;
            if (profile.GameID && profile.GameID !== "") {
                gameRoom = await GameRoomService.GetGameRoom(profile.GameID, profile.ProfileType);
            };

            this.setState({
                _currentProfile: profile,
                _gameRoom: gameRoom
            });

            localStorage.setItem(this.storage_lastChosenProfile, profileName);
            this.UpdateUserTabs();

            didSwitch = true;
        }

        return didSwitch;
    }

    /**
     * Updates the user's tabs based on the current state.
     */
    private UpdateUserTabs(): void {
        var profile: IUserProfile | undefined = this.state._currentProfile;
        var gameTabs: Map<string, JSX.Element> = new Map();

        // TODO: Add in additional user tabs when they're done.
        if (profile !== undefined) {
            switch (profile.ProfileType) {
                case "Player": {
                    gameTabs = this.GetDefaultPlayerTabs();
                    break;
                }
                case "DM": {
                    gameTabs = this.GetDefaultDMTabs();
                    break;
                }
                default: {
                    gameTabs = this.GetErrorMessageTabs();
                    break;
                }
            }
        }

        this.setState({
            _gameTabs: gameTabs
        });
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
            _userProfiles: [],
            _currentProfile: undefined,
            _gameRoom: undefined,
            _gameTabs: new Map(),
            _gameRoomErrors: []
        };
    }

    /**
     * Renders the game tabs present in the game tab state field. The purpose of this is to guarantee
     * a name for each tab that is intentional.
     */
    private RenderTabs(): JSX.Element[] {
        var renderableTabs: JSX.Element[] = [];

        this.state._gameTabs.forEach((value: JSX.Element, key: string) => {
            renderableTabs.push(
                <Tab
                    className="game-tab"
                    title={key}
                    eventKey={key}>
                    {value}
                </Tab>
            )
        });

        return renderableTabs;
    }

    /**
     * Returns the render-able output from this class.
     */
    public render() {
        const handleRoomCreate = () => {
            this.HandleCreateRoom();
        }

        const handleRoomJoin = (roomId: string) => {
            this.HandleJoinRoom(roomId);
        }

        return(
            <div className="game">
                <div className="game-play-area">
                    <Tabs id="GameTabContainer">
                        {this.RenderTabs()}
                    </Tabs>
                </div>
                <div className="game-chat-container">
                    <GameRoomDisplay
                        _createRoomCallback={handleRoomCreate.bind(this)}
                        _joinRoomCallback={handleRoomJoin.bind(this)}
                        _gameRoom={this.state._gameRoom}
                        _externalRoomErrors={this.state._gameRoomErrors}
                        _profile={this.state._currentProfile}
                    />
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
