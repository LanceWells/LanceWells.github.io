import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterImageCanvas } from '../../CharacterImage/React/CharacterImageCanvas';

export interface ICurrentCharacterStatusProps {
    currentCharacterData: PlayerCharacterData | undefined;
}

export function CurrentCharacterStatus(props: ICurrentCharacterStatusProps) {
    let name: string = "";
    let images: string[] = [];
    let borderColor: string = "";

    if (props.currentCharacterData !== undefined) {
        name = props.currentCharacterData.Name;
        images = props.currentCharacterData.CharLayout.GetImages();
        borderColor = props.currentCharacterData.BorderColor;
    }

    return (
        <div className="character-status">
            <div className="character-selector-name">
                <h6>You are currently playing as . . . </h6>
                <h1>{name}</h1>
            </div>
            <CharacterImageCanvas
                charScaleFactor={4}
                showLoadingSpinner={false}
                imagesToRender={images}
                borderColor={borderColor}
            />
        </div>
    )
}
