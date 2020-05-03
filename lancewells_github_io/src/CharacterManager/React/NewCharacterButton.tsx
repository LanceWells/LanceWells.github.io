import React from 'react';

/**
 * The input properties for this component.
 * @param onClick A callback for when this button is clicked.
 */
export interface INewCharacterButtonProps {
    onClick: () => void;
}

/**
 * A button used to allow a user to create a new character. Generally only provides a callback to a higher-
 * level component.
 * @param props 
 */
export function NewCharacterButton(props: INewCharacterButtonProps) {
    return (
        <div className="character-selector-container">
            <button className="new-character-button" onClick={props.onClick}>
                +
            </button>
            <span className="character-selection-name">
                New Character
            </span>
        </div>
    )
}
