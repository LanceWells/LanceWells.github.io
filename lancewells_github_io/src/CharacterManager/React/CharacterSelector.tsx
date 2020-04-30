import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterSelectionButton } from './CharacterSelectionButton';
import { SelectedCharacterCallback } from '../Types/SelectedCharacterCallback';

export interface ICharacterSelectorProps {
    allCharacterData: PlayerCharacterData[];
    characterSelectedCallback: SelectedCharacterCallback;
}

export interface ICharacterSelectorState {
}

export class CharacterSelector extends React.Component<ICharacterSelectorProps, ICharacterSelectorState> {
    public constructor(props: ICharacterSelectorProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="character-selector">
                {this.GetCharacterButtons()}
            </div>
        )
    }

    private GetCharacterButtons(): JSX.Element[] {
        return this.props.allCharacterData.map(charData => {
            return (
                <CharacterSelectionButton
                    characterSelectedCallback={this.props.characterSelectedCallback}
                    characterData={charData}
                />
            )
        })
    }
}
