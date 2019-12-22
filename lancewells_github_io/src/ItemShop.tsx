import './css/ItemShop.css';
import React from 'react';

import {ShopItem} from './ShopItem';

interface IItemShopProps {
};

interface IItemShopState {
};

export class ItemShop extends React.Component<IItemShopProps, IItemShopState> {
    constructor (props: IItemShopProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="ItemShop">
                <h1>Item Shop</h1>
                <div className='shopkeeper-area'>
                    <img src='./images/Item_Shop/brazier-lit.gif' />
                    <img src='./images/Item_Shop/shopkeeper.gif' />
                    <img src='./images/Item_Shop/brazier-lit.gif' />
                </div>
                <div className='bazaar-area'>
                    <div className='shop-rug green-rug'>
                        <ShopItem />
                    </div>
                    <div className='shop-rug red-rug'>
                        <ShopItem />
                    </div>
                </div>
            </div>
        );
    }
}