import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ItemShopData } from '../Types/ItemShopData';
import { GameRoomService } from '../../FirebaseAuth/Classes/GameRoomService';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { ItemShop } from '../../Shops/React/ItemShop';

interface IShopProps {
}

export function Shop(props: IShopProps) {
    const [shopInfo, setShopInfo] = useState<ItemShopData | undefined>(undefined);
    const location = useLocation();

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
    }, [location.pathname])

    return (
        <LoadingPlaceholder showSpinner={shopInfo === undefined} role="Shop Loading Status">
            <div className="shop-page">
                {GetShop(shopInfo)}
            </div>
        </LoadingPlaceholder>
    )
}

function GetShop(shopData: ItemShopData | undefined): JSX.Element {
    let element: JSX.Element;
    element = (
        <div>
        </div>
    );

    if (shopData) {
        element = (
            <ItemShop
                shopData={shopData}
            />
        );
    }

    return element;
}

// http://localhost:3000/#/shop/-M6qoSn88jT2iGbQtnI7
