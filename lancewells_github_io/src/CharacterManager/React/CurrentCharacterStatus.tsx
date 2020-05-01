import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterImageCanvas } from '../../CharacterImage/React/CharacterImageCanvas';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';

export interface ICurrentCharacterStatusProps {
    currentCharacterData: PlayerCharacterData | undefined;
}

export function CurrentCharacterStatus(props: ICurrentCharacterStatusProps) {
    let message: JSX.Element = (
        <div>
            <h6>You don't have a character yet! You should make one here.</h6>
        </div>
    );

    if (props.currentCharacterData !== undefined) {
        message = (
            <div>
                <h6>You are currently playing as . . . </h6>
                <h1>{props.currentCharacterData.Name}</h1>
                <CharacterImageCanvas
                    charScaleFactor={4}
                    showLoadingSpinner={false}
                    imagesToRender={props.currentCharacterData.CharLayout.GetImages()}
                    borderColor={props.currentCharacterData.BorderColor}
                />
            </div>
        )
    }

    return message;
}
