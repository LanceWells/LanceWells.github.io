import React, { ReactNode, ChangeEvent, FormEvent } from 'react';
import { IUserProfile } from '../Interfaces/IUserProfile';
import { UserDataAuth } from '../../Login/Classes/UserDataAuth';
import { IPlayerProfile } from '../Interfaces/IPlayerProfile';
import { CharacterData } from '../../Items/Interfaces/CharacterData';
import { IDMProfile } from '../Interfaces/IDMProfile';

interface IProfileCreationProps {
    OnCreationFinished: Callback_CreationFinished;
}

interface IProfileCreationState {
    _profile: IUserProfile;
    _stage: TCreationStage;
    _errors: string[];
}

export type Callback_CreationFinished = (newProfile: IUserProfile) => void;
type TCreationStage = "SelectProfileType" | "SelectProfileName" | "Validating" | "Done";

export class ProfileCreation extends React.Component<IProfileCreationProps, IProfileCreationState> {
    private nameInput: string = "";

    /**
     * Returns whether or not a given profile name is valid input.
     */
    private ProfileNameIsValid(name: string): boolean {
        // TODO: Make this actually validate.
        return true;
    }

    /**
     * Handles an update to either the properties or to the state of this class.
     * @param prevProps The properties as they were before updating.
     * @param prevState The state as it was before updating.
     */
    componentDidUpdate(prevProps: IProfileCreationProps, prevState: IProfileCreationState) {
        if (prevState._stage !== this.state._stage) {
            switch(this.state._stage) {
                case "Validating": {
                    UserDataAuth.GetInstance().CreateNewProfile(this.state._profile).then((response) => {
                        if (response.DidCreate) {
                            this.setState({
                                _stage: "Done"
                            });
                        }
                        else {
                            this.setState({
                                _stage: "SelectProfileName",
                                _errors: response.Errors
                            })
                        }
                    });
                    break;
                }
                case "Done": {
                    this.props.OnCreationFinished(this.state._profile);
                    break;
                }
                default : {
                    // Nothing.
                    break;
                }
            }
        }
    }

    /**
     * Renders this element based on the current stage of profile creation.
     */
    private RenderStage(): JSX.Element {
        switch(this.state._stage) {
            case "SelectProfileType": {
                // Create a callback for when the DM button is clicked.
                var handleDmClick = () => {
                    var updatedProfile = this.state._profile as IDMProfile;
                    updatedProfile.ProfileType = "DM";

                    this.setState({
                        _profile: updatedProfile,
                        _stage: "SelectProfileName"
                    });
                }

                // Create a callback for when the player button is clicked.
                var handlePlayerClick = () => {
                    var updatedProfile = this.state._profile as IPlayerProfile;
                    updatedProfile.CharData = new CharacterData();
                    updatedProfile.ProfileType = "Player";

                    this.setState({
                        _profile: updatedProfile,
                        _stage: "SelectProfileName"
                    });
                }

                // Return the created element, callbacks and all.
                return (
                    <div>
                        <h4>What type of profile are you making?</h4>
                        <button onClick={handleDmClick}>
                            DM
                        </button>
                        <button onClick={handlePlayerClick}>
                            Player
                        </button>
                    </div>
                );
            }
            case "SelectProfileName": {
                var handleNameInput = (event: ChangeEvent<HTMLInputElement>) => {
                    var input = event.target?.value;
                    if (input) {
                        this.nameInput = input;
                    }
                }

                var handleSubmitClick = (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    var name = this.nameInput;

                    if (this.ProfileNameIsValid(name)) {
                        var updatedProfile = this.state._profile;
                        updatedProfile.ProfileName = name;

                        this.setState({
                            _profile: updatedProfile,
                            _stage: "Validating"
                        });
                    }
                }

                return (
                    <div>
                        <form method="POST" onSubmit={handleSubmitClick}>
                            <input type="text" name="profilename" onChange={handleNameInput} />
                            <input
                                type="submit"
                                value="Create Profile"
                            />
                        </form>
                    </div>
                );
            }
            case "Validating" : {
                return (
                    <div>
                        <h1>Validating Input . . . </h1>
                    </div>
                );
            }
            case "Done": {
                return (
                    <div>
                        <h1>Done!</h1>
                    </div>
                );
            }
            default: {
                return (
                    <div>
                        <h2>There was an error. You should tell Lance.</h2>
                    </div>
                );
            }
        }
    }

    /**
     * Creates a new instance of this class.
     * @param props A set of properties passed-in at creation and listened-to at runtime.
     */
    public constructor(props: IProfileCreationProps) {
        super(props);
        this.state = {
            _profile: {
                ProfileType: "None",
                ProfileImage: "",
                ProfileName: "",
                GameID: null
            },
            _stage: "SelectProfileType",
            _errors: []
        };
    }

    /**
     * Renders this component as a visible part of the page.
     */
    public render(): ReactNode {
        return(
            <div>
                {this.RenderStage()}
            </div>
        );
    }
}
