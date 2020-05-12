import { LoadingState } from '../Enums/LoadingState';
import { useState, useEffect } from 'react';
import { UserDataAuth } from '../../FirebaseAuth/Classes/UserDataAuth';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { LoginState } from '../../LoginPage/Enums/LoginState';

export function useLoadingState(loginState: LoginState) {
    const [loadingState, setLoadingState] = useState(LoadingState.Loading);

    useEffect(() => {
        CheckForUserLogin().then(loadState => {
            setLoadingState(loadState);
        });

    }, [loadingState, loginState]);

    return loadingState;
}

/**
 * Check to see if the user has logged in successfully. This also checks to see if the user has any characters
 * available.
 */
async function CheckForUserLogin(): Promise<LoadingState> {
    let loadingState: LoadingState = LoadingState.Anonymous;
    let userHasAccess: boolean = await UserDataAuth.GetInstance().CheckForAccess();

    if (userHasAccess) {
        let staticCharData: PlayerCharacterData | undefined = undefined;
        staticCharData = await CharacterStateManager.GetInstance().GetCharacter();

        if (staticCharData === undefined) {
            loadingState = LoadingState.NoCharacters;
        }
        else {
            loadingState = LoadingState.Loaded;
        }
    }

    return loadingState;
}