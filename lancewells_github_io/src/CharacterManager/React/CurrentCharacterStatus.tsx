import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';

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
            </div>
        )
    }

    return message;
}
