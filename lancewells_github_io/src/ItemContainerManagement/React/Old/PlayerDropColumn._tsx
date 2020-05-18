import './PlayerDrop.css';

import React, { DragEvent, CSSProperties } from 'react';
import { TPlayerInfo } from '../../Types/TPlayerInfo';

interface IPlayerDropColumnProps {
    PlayerInfo: TPlayerInfo;
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
                className={this.GetDraggingClassname()}
                onDragOver={this.HandleDragOver.bind(this)}
                onDrop={this.HandleDrop.bind(this)}>
                <span className="player-drop-name">
                    {this.props.PlayerInfo.Character.Name}
                </span>
                {this.GetShopNames()}
            </div>
        );
    }

    private GetShopNames(): JSX.Element[] {
        return this.props.PlayerInfo.ShopTabs.map(tab => {
            return (
                <span id={tab.ID}>
                    {tab.Name + " " + tab.Items.length}
                </span>
            )
        })
    }

    private HandleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    private HandleDrop(event: DragEvent<HTMLDivElement>) {
        this.props.HandleDropEvent(this.props.PlayerInfo.Character.Uid);
    }

    private GetDraggingClassname(): string {
        if (this.props.ItemIsHeld) {
            return "player-drop-column-dragging";
        }
        else {
            return "player-drop-column"
        }
    }
}
