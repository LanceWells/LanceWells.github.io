import './PlayerDrop.css';

import React, { DragEvent } from 'react';
import { TCharacterDisplay } from "../../Types/TCharacterDisplay";

interface IPlayerDropColumnProps {
    CharacterDisplay: TCharacterDisplay;
    HandleDropEvent: (playerId: string) => void;
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
            <div
                className="player-drop-column"
                onDragOver={this.HandleDragOver.bind(this)}
                onDrop={this.HandleDrop.bind(this)}>
                <span className="player-drop-name">
                    {this.props.CharacterDisplay.Name}
                </span>
            </div>
        );
    }

    private HandleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    private HandleDrop(event: DragEvent<HTMLDivElement>) {
        this.props.HandleDropEvent(this.props.CharacterDisplay.Uid);
    }
}
