import '../CharacterInfo.css';

import React, { useEffect } from 'react';
import { LoadingState } from '../../Utilities/Enums/LoadingState';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { MoneyAdjustModal } from './MoneyAdjustModal';
import { MoneyDisplay } from './MoneyDisplay';
import { useState } from 'react';
import { useLoadingState } from '../../Utilities/Hooks/useLoadingState';
import { useCharData } from '../../Utilities/Hooks/useCharData';
import { MoneyAdjustCallback } from '../Types/MoneyAdjustCallback';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { LoginState } from '../../LoginPage/Enums/LoginState';

interface ICharacterInfoDisplayProps {
    loginState: LoginState;
}

export function CharacterInfoDisplay(props: ICharacterInfoDisplayProps) {
    const [showMoneyAdjustModal, setShowMoneyAdjustModal] = useState(false);
    const [showMoneyAdjustModalProcessing, setShowMoneyAdjustModalProcessing] = useState(false);
    const loadingState = useLoadingState(props.loginState);
    const charData = useCharData(loadingState);

    /**
     * Handler for when the user requests that the money display modal be shown via a callback.
     */
    const handleShowMoneyAdjust = function () {
        setShowMoneyAdjustModal(true);
    };

    /**
     * Handler for when the user requests that the modal be closed via a callback.
     */
    const handleHideMoneyAdjust = function () {
        setShowMoneyAdjustModal(false);
    }

    /**
     * Handler for when the user requests that the character money be adjusted by some amount.
     * @param newCopperTotal The new copper total to modify for the character.
     */
    const handleAdjustCopper: MoneyAdjustCallback = function (newCopperTotal: number) {
        if (charData) {
            charData.Copper = newCopperTotal;

            setShowMoneyAdjustModalProcessing(true);

            CharacterStateManager.GetInstance().UploadCharacterData(charData).then(() => {
                // setCharData(charData);
                setShowMoneyAdjustModalProcessing(false);
                setShowMoneyAdjustModal(false);
            });
        }
    }

    // Set the default content that will be shown. Note that this is overridden in the event that the user
    // either is not logged in, or does not have any characters.
    let content: JSX.Element = (
        <div className="character-info-content">
            <LoadingPlaceholder
                showSpinner={loadingState === LoadingState.Loading}
                role="Character info status">
                <MoneyAdjustModal
                    show={showMoneyAdjustModal}
                    hideModal={handleHideMoneyAdjust}
                    playerCopper={charData?.Copper ?? 0}
                    showAsProcessing={showMoneyAdjustModalProcessing}
                    moneyAdjustCallback={handleAdjustCopper}
                />
                <span className="character-info-name">
                    {charData?.Name ?? ""}
                </span>
                <MoneyDisplay
                    copperCount={charData?.Copper ?? 0}
                    hideEmptyCurrencies={false}
                />
                <button
                    className="character-money-add"
                    onClick={handleShowMoneyAdjust}>
                    +
                    </button>
            </LoadingPlaceholder>
        </div>
    );

    // Override the default content if the user either doesn't have any characters or is not logged in.
    switch (loadingState) {
        case LoadingState.NoCharacters:
            content = GetNoCharsContent();
            break;
        case LoadingState.Anonymous:
            content = GetAnonContent();
            break;
        default:
            break;
    }

    // Render the element.
    return (
        <div className="character-info-container">
            {content}
        </div>
    );
}

function GetAnonContent(): JSX.Element {
    return (
        <div>
            Logged Out
        </div>
    )
}

function GetNoCharsContent(): JSX.Element {
    return (
        <div>
            No Characters
        </div>
    )
}