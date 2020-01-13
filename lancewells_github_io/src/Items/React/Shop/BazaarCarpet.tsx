import React from 'react';
import {IItemJson} from '../../Interfaces/IItem';
import {ShopItem} from './ShopItem';
import { CarpetMap } from './CarpetMap';
import { ItemCard } from '../Common/ItemCard';

/**
 * @description An interface used to represent the properties required to display this class.
 * @param itemDetails The list of items that will be represented on this carpet.
 * @param onItemClick The function that will be called-back to when an item is clicked on.
 * @param rugBorderSource The source image location for the rug border.
 */
interface IBazaarCarpetProps {
    carpetMap: CarpetMap;
    onItemClick: Function;
}

/**
 * @description Gets the shop items as ShopItem elements.
 * @param itemDetails The list of item details to represent the items on this carpet.
 * @param onItemClick The click event-handler for items.
 * @see ShopItem
 */
function getShopItems(itemDetails: Array<IItemJson>, onItemClick: Function)
{
    return itemDetails.map((item) => {
        return (
            <ItemCard
                itemDetails={item}
                onItemClick={onItemClick}
            />
        );
    });
}

// <ShopItem
//     itemDetails={item}
//     floatDelay={-index}
//     onItemClick={onItemClick}
// />

/**
 * @description Returns an instance of this component, BazaarCarpet.
 * @param props The list of properties needed to render this item.
 */
export function BazaarCarpet(props: IBazaarCarpetProps)
{
    return (
        <div className='shop-section'>
            <h2 className='pixel-font' style={{ fontSize: 18 }}>{props.carpetMap.rugName}</h2>
            <div
                className='shop-rug'
                style={{ borderImageSource: `${props.carpetMap.rugBorderSource}` }}>
                {getShopItems(props.carpetMap.items, props.onItemClick)}
            </div>
        </div>
    );
}
