import React from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {IItemDetails} from './interfaces/IItemDetails';

interface IShopItemProps {
    itemDetails: IItemDetails;
    floatDelay: number;
    onItemClick: Function;
};

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
                        <img src={props.itemDetails.iconSource} />
                    </div>
                </Button>
                <p className='item-cost'>{props.itemDetails.itemCost}x</p>
            </div>
        </OverlayTrigger>
    )
}

// Utilizes the free font:
// https://fonts.google.com/specimen/Press+Start+2P