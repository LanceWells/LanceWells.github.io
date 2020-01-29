import React, { ReactNode } from 'react';
import Tab from 'react-bootstrap/Tab';

export interface IGameTabProps {
    tabIndex: string;
    tabName: string;
    wrappedComponent: JSX.Element;
}

export class GameTab extends React.Component<IGameTabProps> {
    render() {
        return (
            <Tab
                className="game-tab" 
                title={this.props.tabName}
                eventKey={this.props.tabIndex}>
                {this.props.wrappedComponent}
            </Tab>
        )
    }
}
