import './PlayerDrop.css';

import React from 'react';
import { TCharacterDisplay } from "../../Types/TCharacterDisplay";
import { PlayerDropColumn } from './PlayerDropColumn';
import { TPlayerInfo } from '../../Types/TPlayerInfo';

interface IPlayerDropBoxProps {
    PlayerInfo: TPlayerInfo[];
    HandleDropEvent: (playerId: string) => void;
    ItemIsHeld: boolean;
}

interface IPlayerDropBoxState {
}

export class PlayerDropBox extends React.Component<IPlayerDropBoxProps, IPlayerDropBoxState> {
    private allPlayerIdentifier: TPlayerInfo = {
        Character: {
            Uid: "all",
            Name: "All Players",
            Emotion: "None",
            Image: []
        },
        ChestTabs: [],
        // TODO: handle all player shop tabs.
        ShopTabs: []
    }

    public constructor(props: IPlayerDropBoxProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="player-box-container">
                <h3>Players</h3>
                <span>(Drag+Drop shops onto player columns to add them to a player's inventory)</span>
                <div className="player-drop-box">
                    <PlayerDropColumn
                        HandleDropEvent={this.props.HandleDropEvent}
                        ItemIsHeld={this.props.ItemIsHeld}
                        PlayerInfo={this.allPlayerIdentifier}
                    />
                    {this.GetCharacterColumns()}
                </div>
            </div>
        );
    }

    private GetCharacterColumns(): JSX.Element[] {
        return this.props.PlayerInfo.map(char => {
            return (
                <PlayerDropColumn
                    HandleDropEvent={this.props.HandleDropEvent}
                    ItemIsHeld={this.props.ItemIsHeld}
                    PlayerInfo={char}
                />
            )
        })
    }
}
