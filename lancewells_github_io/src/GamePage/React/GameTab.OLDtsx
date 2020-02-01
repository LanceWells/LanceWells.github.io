import React, { ReactNode } from 'react';
import Tab from 'react-bootstrap/Tab';

export interface IGameTabProps {
    tabName: string;
    wrappedComponent: React.Component;
}

export class GameTab extends React.Component<IGameTabProps> {
    render() {
        return (
            <Tab
                className="game-tab" 
                title={this.props.tabName}
                eventKey={this.props.tabName}>
                {this.props.wrappedComponent.render()}
            </Tab>
        )
    }
}
