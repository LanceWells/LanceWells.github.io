import '../CharacterInfo.css';

import React, { useEffect } from 'react';
import { LoadingState } from '../../Utilities/Enums/LoadingState';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { MoneyAdjustModal } from './MoneyAdjustModal';
import { MoneyDisplay } from './MoneyDisplay';
import { useState } from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { useLoadingState } from '../../Utilities/Hooks/useLoadingState';
import { MoneyAdjustCallback } from '../Types/MoneyAdjustCallback';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { LoginState } from '../../LoginPage/Enums/LoginState';

interface ICharacterInfoDisplayProps {
    loginState: LoginState;
}

export function CharacterInfoDisplay(props: ICharacterInfoDisplayProps) {
    const [charData, setCharData] = useState<PlayerCharacterData | undefined>(undefined);
    const [showMoneyAdjustModal, setShowMoneyAdjustModal] = useState(false);
    const [showMoneyAdjustModalProcessing, setShowMoneyAdjustModalProcessing] = useState(false);
    const loadingState = useLoadingState(props.loginState);

    useEffect(() => {
        if (loadingState === LoadingState.Loaded || loadingState == LoadingState.NoCharacters) {
            CharacterStateManager.GetInstance().GetCharacter().then(char => {
                if (char) {
                    setCharData(char);
                }
            });
        }
    }, [loadingState, charData]);

    const handleShowMoneyAdjust = function() {
        setShowMoneyAdjustModal(true);
    };

    const handleHideMoneyAdjust = function() {
        setShowMoneyAdjustModal(false);
    }

    const handleAdjustCopper: MoneyAdjustCallback = function (newCopperTotal: number) {
        if (charData) {
            charData.Copper = newCopperTotal;

            setShowMoneyAdjustModalProcessing(true);

            CharacterStateManager.GetInstance().UploadCharacterData(charData).then(() => {
                setCharData(charData);
                setShowMoneyAdjustModalProcessing(false);
                setShowMoneyAdjustModal(false);
            });
        }
    }

    const characterStateManager_NotifyObservers = function (charData: PlayerCharacterData | undefined): void {
        if (charData) {
            setCharData(charData);
        }
    }

    CharacterStateManager.GetInstance().AddObserver(characterStateManager_NotifyObservers);

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

    switch(loadingState) {
        case LoadingState.NoCharacters:
            content = GetNoCharsContent();
            break;
        case LoadingState.Anonymous:
            content = GetAnonContent();
            break;
        default:
            break;
    }

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