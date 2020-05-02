import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterSelectionButton } from './CharacterSelectionButton';
import { SelectedCharacterCallback } from '../Types/SelectedCharacterCallback';
import { NewCharacterButton } from './NewCharacterButton';
import { Spinner } from 'react-bootstrap';

export interface ICharacterSelectorProps {
    allCharacterData: PlayerCharacterData[];
    characterSelectedCallback: SelectedCharacterCallback;
    isLoading: boolean;
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
        let showSpinner: boolean = this.props.isLoading;
        let showNoCharactersMessage: boolean = this.props.allCharacterData.length === 0 && !this.props.isLoading;

        return (
            <div className="character-selector">
                <h2>
                    Characters:
                </h2>
                <h4 style={{ visibility: showNoCharactersMessage ? 'visible' : 'hidden' }}>
                    You don't have any characters yet! You should make one.
                </h4>
                <div className="character-selector-buttons">
                    <Spinner
                        animation="border"
                        role="character button status"
                        style={{ visibility: showSpinner ? 'visible' : 'hidden' }}
                    />
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
