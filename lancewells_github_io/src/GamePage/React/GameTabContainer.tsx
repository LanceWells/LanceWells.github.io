import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { GameTab } from './GameTab';
import { SelectCallback } from 'react-bootstrap/helpers';

interface IGameTabContainerProps {
    tabsId: string;
    tabs: GameTab[];
}

interface IGameTabContainerState {
    tabIndex: string;
}

export class GameTabContainer extends React.Component<IGameTabContainerProps, IGameTabContainerState> {
    public constructor(props: IGameTabContainerProps) {
        super(props);
        this.state = {
            tabIndex: ""
        }
    }

    private RenderTabs(): JSX.Element[] {
        return this.props.tabs.map(tab => tab.render());
    }

    render() {
        const handleSelection: SelectCallback = (eventKey: string, e: React.SyntheticEvent<unknown, Event>) => {
            this.setState({
                tabIndex: eventKey
            });
        }

        return (
            <div
                className="game-tab-container">
                <Tabs
                    id={this.props.tabsId}
                    activeKey={this.state.tabIndex}
                    onSelect={handleSelection}>
                    {this.RenderTabs()}
                </Tabs>
            </div>
        )
    }
}
