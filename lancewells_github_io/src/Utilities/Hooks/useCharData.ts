import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { LoadingState } from '../Enums/LoadingState';
import { useState, useEffect } from 'react';

/**
 * 
 * @param loadingState The loading state for this component. Note that this requires fetching the
 * 'LoadingState' using the 'useLoadingState' hook. This violates the DRY principle by calling GetCharacter()
 * a second time in this function. That said, this action should only re-fetch a static resource, and keeping
 * this hook separate form useLoadingState ensures that we have a singular flow of information, from getting
 * information about what state we're in to what character (if we have one) to show.
 */
export function useCharData(loadingState: LoadingState): PlayerCharacterData | undefined {
    const [charData, setCharData] = useState<PlayerCharacterData | undefined>(undefined);

    /**
     * Attempt to load the character data. Do this only if we know that we're in a logged-in state, or if we
     * have changed login states or character data.
     */
    useEffect(() => {
        if (loadingState === LoadingState.Loaded || loadingState === LoadingState.NoCharacters) {
            CharacterStateManager.GetInstance().GetCharacter().then(char => {
                if (char) {
                    setCharData(char);
                }
            });
        }

        /**
        * A handler for when the character state manager has changed its character data.
        * @param charData The character data that has been changed.
        */
        const characterStateManager_NotifyObservers = function (charData: PlayerCharacterData | undefined): void {
            if (charData) {
                setCharData(charData);
            }
        }

        // Ensure that we are notified by the character state manager whenever there are changes to the active
        // character.
        CharacterStateManager.GetInstance().AddObserver(characterStateManager_NotifyObservers);

        return () => {
            CharacterStateManager.GetInstance().RemoveObserver(characterStateManager_NotifyObservers);
        }
    }, [loadingState, charData]);

    // /**
    // * A handler for when the character state manager has changed its character data.
    // * @param charData The character data that has been changed.
    // */
    // const characterStateManager_NotifyObservers = function (charData: PlayerCharacterData | undefined): void {
    //     if (charData) {
    //         setCharData(charData);
    //     }
    // }

    // // Ensure that we are notified by the character state manager whenever there are changes to the active
    // // character.
    // CharacterStateManager.GetInstance().AddObserver(characterStateManager_NotifyObservers);

    return charData;
}
