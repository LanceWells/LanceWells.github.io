import React from 'react';
import { MoneyDisplay } from './MoneyDisplay';

interface ICharacterInfoContainerProps {
    playerCopper: number;
}

interface ICharacterInfoContainerState {
}

export class CharacterInfoContainer extends React.Component<ICharacterInfoContainerProps, ICharacterInfoContainerState> {
    public constructor(props: ICharacterInfoContainerProps) {
        super(props);
        this.state = {
        }
    }

    public render() {
        return (
            <div className="character-info-container">
                <MoneyDisplay
                    playerCopper={this.props.playerCopper}
                />
            </div>
        );
    }
}
