import React from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { IItem } from "../../Interfaces/IItem";

/**
 * @description A series of properties needed to render this component.
 * @param itemDetails The set of item details that are used to represent this item.
 * @param floatDelay The amount of time to offset the delay for this item's float animation.
 * @param onItemClick The click event-handler when this item is clicked. Will need to pass back the item
 * details property.
 */
interface IShopItemProps {
    itemDetails: IItem;
    floatDelay: number;
    onItemClick: Function;
};

/**
 * Returns an instance of this component.
 * @param props The properties requried to render this component.
 * 
 * Utilizes this free font:
 * https://fonts.google.com/specimen/Press+Start+2P
 */
export function ShopItem(props: IShopItemProps) {
    return (
        <OverlayTrigger
            placement='top'
            delay={{ show: 0, hide: 400 }}
            overlay={
                <Tooltip id='item-tooltip'>
                    {props.itemDetails.title}
                </Tooltip>
            }
            >
            <div className='item-box'>
                <Button variant='link' onClick={() => props.onItemClick(props.itemDetails)}>
                    <div className='item-layer' style={{ animationDelay: `${props.floatDelay}s` }}>
                        <img src={props.itemDetails.iconSource} alt="item icon"/>
                    </div>
                </Button>
                <div className='item-cost'>
                    <div>
                        {props.itemDetails.itemCost}x
                    </div>
                    <div>
                        <img className='item-coin' src='./images/Item_Shop/itemCoinStill.png' alt="coin icon"/>
                    </div>
                </div>
            </div>
        </OverlayTrigger>
    )
}
