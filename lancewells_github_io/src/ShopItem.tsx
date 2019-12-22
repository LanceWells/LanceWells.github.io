import React from 'react';
import {Button} from 'react-bootstrap';

interface IShopItemProps {
    imageSource: string;
    floatDelay: number;
};

export function ShopItem(props: IShopItemProps) {
    const animationDelay = props.floatDelay;

    return (
        <Button variant='link'>
            <div className='item-layer' style={{animationDelay: `${animationDelay}s`}}>
                <img src={props.imageSource}/>
            </div>
        </Button>
    )
}
