import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ItemShopData } from '../Types/ItemShopData';
import { GameRoomService } from '../../FirebaseAuth/Classes/GameRoomService';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { ItemShop } from '../../Shops/React/ItemShop';
import { useCharData } from '../../Utilities/Hooks/useCharData';
import { useLoadingState } from '../../Utilities/Hooks/useLoadingState';
import { LoadingState } from '../../Utilities/Enums/LoadingState';
import { LoginState } from '../../LoginPage/Enums/LoginState';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';

interface IShopProps {
    loginState: LoginState;
}

export function Shop(props: IShopProps) {
    const [shopInfo, setShopInfo] = useState<ItemShopData | undefined>(undefined);
    const location = useLocation();
    const loadingState = useLoadingState(props.loginState);
    const charData = useCharData(loadingState);

    /**
     * Runs only when the URL has changed. Updates the rendered store for this page.
     */
    useEffect(() => {
        let shopRegex: RegExp = /\/shop\/([-_A-Z0-9]+)/i;
        let shopMatch: RegExpExecArray | null = shopRegex.exec(location.pathname);
        let shopId: string | undefined = undefined;

        if (shopMatch && shopMatch[1]) {
            shopId = shopMatch[1];
            GameRoomService.GetShopByShopId(shopId).then(shop => {
                setShopInfo(shop);
            });
        }
    }, [location.pathname, shopInfo])

    return (
        <LoadingPlaceholder showSpinner={loadingState === LoadingState.Loading} role="Shop Loading Status">
            <div className="shop-page">
                {GetShop(shopInfo, charData)}
            </div>
        </LoadingPlaceholder>
    );
}

function GetShop(shopData: ItemShopData | undefined, charData: PlayerCharacterData | undefined): JSX.Element {
    let element: JSX.Element;
    element = (
        <div>
        </div>
    );

    if (shopData) {
        element = (
            <ItemShop
                shopData={shopData}
                charData={charData}
            />
        );
    }

    return element;
}

// http://localhost:3000/#/shop/-M6qoSn88jT2iGbQtnI7
