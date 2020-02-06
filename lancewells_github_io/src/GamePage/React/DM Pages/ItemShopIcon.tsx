import './ItemShopManager.css';

import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TShopTab } from '../../Types/TShopTab';

const shopIconLocation: string = './images/Item_Shop/ShopIcon.png'

interface IItemShopIcon {
    _shopTab: TShopTab;
    _maxItemsInTooltip: number;
    _width: number;
    _height: number;
    // RemoveCallback
    // EditCallback

}

export function ItemShopIcon(props: IItemShopIcon) {
    return (
        <div className="shopmgr-icon-container">
            <span>{props._shopTab.Name}</span>
            <OverlayTrigger
                placement="top"
                delay={{ show: 0, hide: 400 }}
                overlay={
                    <Tooltip id="item-shop-tooltip" className="shopmgr-icon-tooltip">
                        {GetTooltipText(props._shopTab, props._maxItemsInTooltip)}
                    </Tooltip>
                }>
                <div className="shopmgr-icon">
                    <img
                        alt="Shop Icon"
                        src={shopIconLocation}
                        style={{
                            width: `${props._width}px`,
                            height: `${props._height}px`
                        }}
                    />
                </div>
            </OverlayTrigger>
        </div>
    )
}

function GetTooltipText(shop: TShopTab, maxItemsInTooltip: number) {
    var itemsAsList: string[] = shop.Items.map(item => item.title);
    var numItemsToKeep: number = Math.min(itemsAsList.length, maxItemsInTooltip);
    var itemsDesc: string = itemsAsList.slice(0, numItemsToKeep).join(', ');

    if (maxItemsInTooltip < itemsAsList.length) {
        itemsDesc += " . . .";
    }

    var itemTooltip: string = `${itemsAsList.length} items: ${itemsDesc}`;
    return itemTooltip;
}