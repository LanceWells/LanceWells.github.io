import React from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

interface IShopItemProps {
    imageSource: string;
    itemName: string;
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
                    {props.itemName}
                </Tooltip>
            }
            >
            <Button variant='link' onClick={() => props.onItemClick(props.itemName)}>
                <div className='item-layer' style={{ animationDelay: `${props.floatDelay}s` }}>
                    <img src={props.imageSource} />
                </div>
            </Button>
        </OverlayTrigger>
    )
}
