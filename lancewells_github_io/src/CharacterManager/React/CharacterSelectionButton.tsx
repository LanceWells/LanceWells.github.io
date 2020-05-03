import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { SelectedCharacterCallback } from '../Types/SelectedCharacterCallback';
import { CharacterImageCanvas } from '../../CharacterImage/React/CharacterImageCanvas';

/**
 * The input properties for this component.
 * @param characterData The character data that is represented by this button.
 * @param characterSelectedCallback A callback for a higher component when this button is selected.
 */
export interface ICharacterSelectionButtonProps {
    characterData: PlayerCharacterData;
    characterSelectedCallback: SelectedCharacterCallback;
}

/**
 * A button used to represent a character selection. This is displayed alongside other character selection
 * buttons.
 * @param props The input properties for this component.
 */
export function CharacterSelectionButton(props: ICharacterSelectionButtonProps) {
    return (
        <div className="character-selector-container">
            <button
                className="character-selection-button"
                onClick={() => props.characterSelectedCallback(props.characterData)}>
                <CharacterImageCanvas
                    charScaleFactor={2}
                    showLoadingSpinner={false}
                    imagesToRender={props.characterData.CharLayout.GetImages()}
                    borderColor={props.characterData.BorderColor}
                    />
            </button>
            <span className="character-selection-name">
                {props.characterData.Name}
            </span>
        </div>
    )
}
