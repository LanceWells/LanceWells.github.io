import React from 'react';
import {IItemDetails} from './interfaces/IItemDetails';
import {ShopItem} from './ShopItem';

interface IBazaarCarpetProps {
    itemDetails: Array<IItemDetails>;
    onItemClick: Function;
    rugBorderSource: string;
}

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
