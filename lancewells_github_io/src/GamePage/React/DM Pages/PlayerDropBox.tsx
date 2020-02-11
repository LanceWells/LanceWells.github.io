import './PlayerDrop.css';

import React from 'react';
import { TCharacterDisplay } from "../../Types/TCharacterDisplay";
import { PlayerDropColumn } from './PlayerDropColumn';

interface IPlayerDropBoxProps {
    CharacterDisplay: TCharacterDisplay[];
    HandleDropEvent: (playerId: string) => void;
    ItemIsHeld: boolean;
}

interface IPlayerDropBoxState {
}

export class PlayerDropBox extends React.Component<IPlayerDropBoxProps, IPlayerDropBoxState> {
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
                    {this.GetCharacterColumns()}
                </div>
            </div>
        );
    }

    private GetCharacterColumns(): JSX.Element[] {
        return this.props.CharacterDisplay.map(char => {
            return (
                <PlayerDropColumn
                    HandleDropEvent={this.props.HandleDropEvent}
                    ItemIsHeld={this.props.ItemIsHeld}
                    CharacterDisplay={char}
                />
            )
        })
    }
}
