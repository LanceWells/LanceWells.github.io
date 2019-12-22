import React from 'react';
import {Button} from 'react-bootstrap';

interface IShopItemProps {
};

export function ShopItem(props: IShopItemProps) {
    return (
        <div className="shop-item">
            <Button variant='link'>
                <div className='item-layer' style={{animationDelay: '0s'}}>
                    <img src='./images/Item_Shop/Items/Rings/Ring Jewel Red.png'/>
                </div>
            </Button>
            <Button variant='link'>
                <div className='item-layer' style={{ animationDelay: '1s' }}>
                    <img src='./images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png' />
                </div>
            </Button>
            <Button variant='link'>
                <div className='item-layer' style={{ animationDelay: '2s' }}>
                    <img src='./images/Item_Shop/Items/Rings/Ring Silver Snake Flower Blue.png' />
                </div>
            </Button>
            <Button variant='link'>
                <div className='item-layer' style={{ animationDelay: '3s' }}>
                    <img src='./images/Item_Shop/Items/Rings/Ring Simple.png' />
                </div>
            </Button>
        </div>
    )
}
