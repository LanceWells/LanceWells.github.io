import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterSelectionButton } from './CharacterSelectionButton';
import { SelectedCharacterCallback } from '../Types/SelectedCharacterCallback';
import { NewCharacterButton } from './NewCharacterButton';
import { Spinner } from 'react-bootstrap';

/**
 * The input properties for this component.
 * @param allCharacterData A list of all character data for this user.
 * @param characterSelectedCallback A callback for when the character is selected.
 * @param newCharacterButtonCallback A callback for when the new character button is selected.
 * @param isLoading If true, render this component as though it is loading.
 */
export interface ICharacterSelectorProps {
    allCharacterData: PlayerCharacterData[];
    characterSelectedCallback: SelectedCharacterCallback;
    newCharacterButtonCallback: () => void;
    isLoading: boolean;
}

/**
 * A container for a series of buttons that are used to manage character state, including existing and new
 * character buttons.
 * @param props The input properties for this component.
 */
export function CharacterSelector(props: ICharacterSelectorProps) {
    let showSpinner: boolean = props.isLoading;
    let showNoCharactersMessage: boolean = props.allCharacterData.length === 0 && !props.isLoading;

    let characterButtons: JSX.Element[] = props.allCharacterData.map(charData => {
        return (
            <CharacterSelectionButton
                characterSelectedCallback={props.characterSelectedCallback}
                characterData={charData}
            />
        )
    })

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
                {characterButtons}
                <NewCharacterButton
                    onClick={props.newCharacterButtonCallback}
                />
            </div>
        </div>
    )
}
