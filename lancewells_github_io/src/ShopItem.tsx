import React from 'react';
import {Button} from 'react-bootstrap';

interface IShopItemProps {
};

export function ShopItem(props: IShopItemProps) {
    return (
        <div className="shop-item">
            <Button variant='link'>
                <img className='item-layer' src='./images/Item_Shop/Items/Rings/gold_simple.gif' />
                <img className='item-layer' src='./images/Item_Shop/Items/Rings/gold_standard_jewel_red.gif' />
                <img className='item-layer' src='./images/Item_Shop/Items/Rings/silver_snake_flower_blue.gif' />
                <img className='item-layer' src='./images/Item_Shop/Items/Rings/silver_standard_jewel_green.gif' />
            </Button>
        </div>
    )
}
