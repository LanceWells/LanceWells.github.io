import './css/ItemShop.css';
import React from 'react';

import { ShopItem } from './ShopItem';
import { Modal, ModalTitle, Button } from 'react-bootstrap';
import { SourceTypes } from './SourceTypes';
import { ItemDetails } from './ItemDetails';

interface IItemShopProps {
};

interface IItemShopState {
    showItemDialog: boolean;
    itemDetails: ItemDetails;
};

export class ItemShop extends React.Component<IItemShopProps, IItemShopState> {
    constructor (props: IItemShopProps) {
        super(props);
        this.state = {
            showItemDialog: false,
            itemDetails: {
                title: '',
                body: '',
                iconSource: '',
                itemCost: 0,
                source: SourceTypes.homebrew
            }
        };
    }

    setModalVisiblity(show: boolean)
    {
        this.setState({
            showItemDialog: show
        });
    }

    onItemClick(item: ItemDetails)
    {
        this.setState({
            itemDetails: item,
        });
        
        this.setModalVisiblity(true);
    }

    getSourceText(source: SourceTypes)
    {
        switch(source)
        {
            case SourceTypes.official:
            {
                return (<p style={{color: 'rgb(255, 153, 0)'}}>Official</p>);
            }
            case SourceTypes.homebrew:
            {
                return (<p style={{color: 'rgb(153, 0, 153)'}}>Official</p>);
            }
        };
    }

    render()
    {
        /* Keep these as consts because if we were to use a function callback when closing the Modal,
         * that would result in an exception (because we're then in a state that doesn't recognize)
         * ItemShop as 'this'. */
        const hideModal = () => this.setModalVisiblity(false);
        const showModal = () => this.setModalVisiblity(true);
        
        const redRing: ItemDetails = {
            title: 'Ring Jewel Red',
            body: '',
            iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
            source: SourceTypes.official,
            itemCost: 100
        };


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
                            itemDetails={redRing}
                            floatDelay= {0}
                            onItemClick={(itemDetails: ItemDetails) => this.onItemClick(itemDetails)}
                        />
                    </div>
                    <div className='shop-rug red-rug'>
                        <ShopItem
                            itemDetails={redRing}
                            floatDelay={0}
                            onItemClick={(itemDetails: ItemDetails) => this.onItemClick(itemDetails)}
                        />
                    </div>
                </div>
                <Modal
                    size="lg"
                    show={this.state.showItemDialog}
                    onHide={hideModal}
                    centered={true}>
                    <Modal.Header>
                        <Modal.Title className='pixel-font'>
                            {this.state.itemDetails.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='item-preview'>
                            <img src={this.state.itemDetails.iconSource} width={128} height={128} />
                        </div>
                        <hr className='white-hr' />
                        <div className='item-details pixel-font'>
                            {this.getSourceText(this.state.itemDetails.source)}
                        </div>
                        <hr className='white-hr' />
                        {this.state.itemDetails.body}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='dark' onClick={hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}