import React from 'react';
import {IItemDetails} from './interfaces/IItemDetails';
import {ShopItem} from './ShopItem';

/**
 * @description An interface used to represent the properties required to display this class.
 * @param itemDetails The list of items that will be represented on this carpet.
 * @param onItemClick The function that will be called-back to when an item is clicked on.
 * @param rugBorderSource The source image location for the rug border.
 */
interface IBazaarCarpetProps {
    itemDetails: Array<IItemDetails>;
    onItemClick: Function;
    rugBorderSource: string;
}

/**
 * @description Gets the shop items as ShopItem elements.
 * @param itemDetails The list of item details to represent the items on this carpet.
 * @param onItemClick The click event-handler for items.
 * @see ShopItem
 */
function getShopItems(itemDetails: Array<IItemDetails>, onItemClick: Function)
{
    return itemDetails.map((item, index) => {
        return (
            <ShopItem
                itemDetails={item}
                floatDelay={-index}
                onItemClick={onItemClick}
            />
        );
    });
}

/**
 * @description Returns an instance of this component, BazaarCarpet.
 * @param props The list of properties needed to render this item.
 */
export function BazaarCarpet(props: IBazaarCarpetProps)
{
    return (
        <div
            className='shop-rug'
            style={{borderImageSource: `${props.rugBorderSource}`}}>
            {getShopItems(props.itemDetails, props.onItemClick)}
        </div>
    );
}
