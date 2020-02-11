import './PlayerDrop.css';

import React from 'react';
import { TCharacterDisplay } from "../../Types/TCharacterDisplay";

interface IPlayerDropColumnProps {
    CharacterDisplay: TCharacterDisplay;
    ItemIsHeld: boolean;
}

interface IPlayerDropColumnState {
}

export class PlayerDropColumn extends React.Component<IPlayerDropColumnProps, IPlayerDropColumnState> {
    public constructor(props: IPlayerDropColumnProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="player-drop-column">
                <span className="player-drop-name">
                    {this.props.CharacterDisplay.Name}
                </span>
            </div>
        );
    }
}
