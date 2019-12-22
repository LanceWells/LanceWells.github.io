import React from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

interface IShopItemProps {
    imageSource: string;
    itemName: string;
    itemCost: number;
    floatDelay: number;
    source: "Official" | "Homebrew";
    onItemClick: Function;
};

export function ShopItem(props: IShopItemProps) {
    return (
        <OverlayTrigger
            placement='top'
            delay={{ show: 0, hide: 400 }}
            overlay={
                <Tooltip id='item-tooltip'>
                    {props.itemName}
                </Tooltip>
            }
            >
            <div className='item-box'>
                <Button variant='link' onClick={() => props.onItemClick(props.itemName)}>
                    <div className='item-layer' style={{ animationDelay: `${props.floatDelay}s` }}>
                        <img src={props.imageSource} />
                    </div>
                </Button>
                <p className='item-cost'>{props.itemCost}x</p>
            </div>
        </OverlayTrigger>
    )
}

// Utilizes the free font:
// https://fonts.google.com/specimen/Press+Start+2P