import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterSelectionButton } from './CharacterSelectionButton';
import { SelectedCharacterCallback } from '../Types/SelectedCharacterCallback';
import { NewCharacterButton } from './NewCharacterButton';

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
                <h2>
                    Characters:
                </h2>
                <div className="character-selector-buttons">
                    {this.GetCharacterButtons()}
                    <NewCharacterButton />
                </div>
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
