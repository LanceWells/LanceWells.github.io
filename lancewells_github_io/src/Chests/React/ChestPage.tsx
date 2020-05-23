import "../ChestDisplay.css"

import React, { useState, useEffect } from 'react';
import { ChestData } from '../Types/ChestData';
import { useLocation } from 'react-router-dom';
import { GameRoomService } from '../../FirebaseAuth/Classes/GameRoomService';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { useCharData } from '../../Utilities/Hooks/useCharData';
import { useLoadingState } from '../../Utilities/Hooks/useLoadingState';
import { LoadingState } from '../../Utilities/Enums/LoadingState';
import { LoginState } from '../../LoginPage/Enums/LoginState';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ChestDisplay } from './ChestDisplay';

export interface IChestPageProps {
    loginState: LoginState;
}

export function ChestPage(props: IChestPageProps) {
    const [chestInfo, setChestInfo] = useState<ChestData | undefined>(undefined);
    const loadingState = useLoadingState(props.loginState);
    const location = useLocation();
    const charData = useCharData(loadingState);

    /**
     * Runs only when the URL has changed. Updates the rendered store for this page.
     */
    useEffect(() => {
        let chestRegex: RegExp = /\/chest\/([-_A-Z0-9]+)/i;
        let chestMatch: RegExpExecArray | null = chestRegex.exec(location.pathname);
        let chestId: string | undefined = undefined;

        if (chestMatch && chestMatch[1]) {
            chestId = chestMatch[1];
            GameRoomService.GetChestByChestId(chestId).then(chest => {
                setChestInfo(chest);
            });
        }
    }, [location.pathname])

    return (
        <LoadingPlaceholder showSpinner={loadingState === LoadingState.Loading} role="Chest Loading Status">
            <div className="chest-page">
                {GetChest(chestInfo, charData, loadingState)}
            </div>
        </LoadingPlaceholder>
    );
}

function GetChest(chestData: ChestData | undefined, charData: PlayerCharacterData | undefined, loadingState: LoadingState): JSX.Element {
    let element: JSX.Element;
    element = (
        <div>
        </div>
    );

    if (chestData) {
        element = (
            <ChestDisplay
                chestData={chestData}
                charData={charData}
                loadingState={loadingState}
            />
        );
    }

    return element;
}
