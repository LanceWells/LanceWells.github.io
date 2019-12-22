import './css/ItemShop.css';
import React from 'react';

import { ShopItem } from './ShopItem';
import { Modal, ModalTitle } from 'react-bootstrap';

interface IItemShopProps {
};

interface IItemShopState {
    showItemDialog: boolean;
    itemDialogTitle: string;
    itemDialogBody: string;
};

export class ItemShop extends React.Component<IItemShopProps, IItemShopState> {
    constructor (props: IItemShopProps) {
        super(props);
        this.state = {
            showItemDialog: false,
            itemDialogTitle: 'test title',
            itemDialogBody: 'test body',
        };
    }

    setModalVisiblity(show: boolean)
    {
        this.setState({
            showItemDialog: show
        });
    }

    onItemClick(itemTitle: string)
    {
        this.setState({
            itemDialogTitle: itemTitle,
        });
        
        this.setModalVisiblity(true);
    }

    render() {
        /* Keep these as consts because if we were to use a function callback when closing the Modal,
         * that would result in an exception (because we're then in a state that doesn't recognize)
         * ItemShop as 'this'. */
        const hideModal = () => this.setModalVisiblity(false);
        const showModal = () => this.setModalVisiblity(true);

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
                        <ShopItem 
                            imageSource='./images/Item_Shop/Items/Rings/Ring Jewel Red.png'
                            floatDelay={0}
                            itemName='Ring Jewel Red'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png'
                            floatDelay={-1}
                            itemName='Ring Silver Jewel Green'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Silver Snake Flower Blue.png'
                            floatDelay={-2}
                            itemName='Ring Silver Snake Flower Blue'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Simple.png'
                            floatDelay={-3}
                            itemName='Ring Simple'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                    </div>
                    <div className='shop-rug red-rug'>
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Jewel Red.png'
                            floatDelay={0}
                            itemName='Ring Jewel Red'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png'
                            floatDelay={-1}
                            itemName='Ring Silver Jewel Green'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Silver Snake Flower Blue.png'
                            floatDelay={-2}
                            itemName='Ring Silver Snake Flower Blue'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                        <ShopItem
                            imageSource='./images/Item_Shop/Items/Rings/Ring Simple.png'
                            floatDelay={-3}
                            itemName='Ring Simple'
                            onItemClick={(itemTitle: string) => this.onItemClick(itemTitle)}
                        />
                    </div>
                </div>
                <Modal show={this.state.showItemDialog} onHide={hideModal} centered={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.state.itemDialogTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.itemDialogBody}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}