import React, { ChangeEvent, FormEvent } from 'react';
import { IGameRoom } from '../Interfaces/IGameRoom';
import { IUserProfile } from '../Interfaces/IUserProfile';
import { ProfileIsDM } from '../Interfaces/IDMProfile';
import { ProfileIsPlayer } from '../Interfaces/IPlayerProfile';

type GameRoomState = "NoProfile" | "CreateRoom" | "JoinRoom" | "ShowPlayers" | "Error";

interface IGameRoomDisplayProps {
    _gameRoom: IGameRoom | undefined;
    _profile: IUserProfile | undefined;
    _externalRoomErrors: string[];
    _createRoomCallback: () => void;
    _joinRoomCallback: (roomId: string) => void;
}

interface IGameRoomDisplayState {
    _roomState: GameRoomState;
}

/**
 * Displays the game room details on the right-hand pane.
 */
export class GameRoomDisplay extends React.Component<IGameRoomDisplayProps, IGameRoomDisplayState> {
    private roomIdInput: string = "";

    public constructor (props: IGameRoomDisplayProps) {
        super(props);
        this.state = {
            _roomState: "NoProfile"
        };
    }

    /**
     * Handles events when the component has updated.
     * @param prevProps The previous props prior to the update.
     */
    public componentDidUpdate(prevProps: IGameRoomDisplayProps) {
        if (prevProps !== this.props) {
            var profile = this.props._profile;

            // If there is no profile at all, just show the "no profile" space.
            if (profile === undefined) {
                this.setState({
                    _roomState: "NoProfile"
                });
            }
            // Otherwise, if there is a profile, the player has something actionable to do.
            else {
                // First, check if the game room is defined or not. if the game room is defined, that
                // means that the user already has a room that they can join. If the room is not defined,
                // then the player will have to go find a room to join first, or make one themselves if
                // they are a DM.
                if (this.props._gameRoom === undefined) {
                    if (ProfileIsPlayer(profile)) {
                        this.setState({
                            _roomState: "JoinRoom"
                        });
                    }
                    else if (ProfileIsDM(profile)) {
                        this.setState({
                            _roomState: "CreateRoom"
                        });
                    }
                    else {
                        // This shouldn't be possible unless there's a new profile role that hasn't been
                        // accounted-for yet.
                        this.setState({
                            _roomState: "Error"
                        });
                    }
                }
                else {
                    this.setState({
                        _roomState: "ShowPlayers"
                    });
                }
            }
        }
    }

    /**
     * Renders this component.
     */
    public render() {
        return (
            <div>
                <h4>{this.props._externalRoomErrors.join(" ")}</h4>
                {this.GetRenderableSpace()}
            </div>
        );
    }

    /**
     * Gets the renderable space according to the current state.
     */
    private GetRenderableSpace(): JSX.Element {
        const errorDisplay: JSX.Element = (
            <div>
                <h3>There was an error somewhere. You should tell Lance.</h3>
            </div>
        );

        switch(this.state._roomState) {
            case "NoProfile": {
                return (
                    <div>
                        <h2>You haven't chosen a profile yet.</h2>
                    </div>
                );
                break;
            }
            case "CreateRoom": {
                return (
                    <div>
                        <h2>Hello GM! Once you make a room, you can invite other people to join!</h2>
                        <button onClick={this.props._createRoomCallback}>Create Room</button>
                    </div>
                );
                break;
            }
            case "JoinRoom": {
                var handleJoinRoom = (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    var roomid = this.roomIdInput;
                    this.props._joinRoomCallback(roomid);
                }

                var handleRoomIdInput = (event: ChangeEvent<HTMLInputElement>) => {
                    var input = event.target?.value;
                    if (input) {
                        this.roomIdInput = input;
                    }
                };

                return (
                    <div>
                        <h2>Hello Player! You'll need to join a room in order to play with others.</h2>
                        <form method="POST" onSubmit={handleJoinRoom.bind(this)}>
                            <input type="text" name="roomid" onChange={handleRoomIdInput.bind(this)} />
                            <input type="submit" value="Join Room"/>
                        </form>
                    </div>
                );
                break;
            }
            case "ShowPlayers": {
                if (this.props._gameRoom !== undefined) {
                    return (
                        <div>
                            <h3>{this.props._gameRoom.RoomName}</h3>
                            <ul>
                                {this.props._gameRoom.Characters.map(c => {
                                    return (<li>{c.Name}</li>)
                                })}
                            </ul>
                        </div>
                    );
                }
                break;
            }
            case "Error":   return errorDisplay;
            default:        return errorDisplay;
        }

        return errorDisplay;
    }
}
