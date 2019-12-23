import './css/ItemShop.css';
import React from 'react';

import { Modal, Button } from 'react-bootstrap';
import { SourceTypes } from './enums/SourceTypes';
import { IItemDetails } from './interfaces/IItemDetails';
import { ItemType } from './enums/ItemType';
import { BazaarCarpet } from './BazaarCarpet';

/**
 * @description
 * Describes the properties that are passed into this class.
 */
interface IItemShopProps {
};

/**
 * @description Describes the state that is maintained by this object.
 * @param showItemDialog A boolean value to describe whether the item dialog (modal) is displayed at any
 * given point.
 * @param itemDetails A set of details that describe the currently selected item. This is used to populate
 * the modal that appears.
 */
interface IItemShopState {
    showItemDialog: boolean;
    itemDetails: IItemDetails;
};

/**
 * @description
 * Represents an item shop! This is a full-screen application that is used to 'browse' some digital items.
 */
export class ItemShop extends React.Component<IItemShopProps, IItemShopState> {
    /**
     * @description Creates a new instance of @see ItemShop .
     * @param props The properties required to instantiate this class.
     */
    constructor (props: IItemShopProps) {
        super(props);
        this.state = {
            showItemDialog: false,
            itemDetails: {
                title: '',
                body: '',
                iconSource: '',
                itemCost: 0,
                source: SourceTypes.homebrew,
                type: ItemType.wondrous,
            }
        };
    }

    /**
     * @description
     * Shows or hides the item details modal.
     * @param show If true, show the modal; otherwise false.
     */
    setModalVisiblity(show: boolean)
    {
        this.setState({
            showItemDialog: show
        });
    }

    /**
     * @description Handles an item click event.
     * @param item The item details that are provided as a result of the click event (this is a set of
     * properties that represent the item that was clicked).
     */
    onItemClick(item: IItemDetails)
    {
        this.setState({
            itemDetails: item,
        });
        
        this.setModalVisiblity(true);
    }

    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the source
     * of the item that is being displayed.
     * @param source The source to lookup and return a <p> element that represents it.
     */
    getSourceText(source: SourceTypes)
    {
        switch(source)
        {
            case SourceTypes.official:
            {
                return (<p style={{color: 'rgb(255, 200, 37)'}}>Official</p>);
            }
            case SourceTypes.homebrew:
            {
                return (<p style={{color: 'rgb(147, 56, 143)'}}>Homebrew</p>);
            }
        };
    }

    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the type
     * of the item that is being displayed.
     * @param type The type to lookup and return a <p> element that represents it.
     */
    getTypeText(type: ItemType) {
        switch (type) {
            case ItemType.weapon:
            {
                return (<p style={{ color: 'rgb(199, 207, 221)' }}>Weapon</p>);
            }
            case ItemType.armor:
            {
                return (<p style={{ color: 'rgb(148, 253, 255)' }}>Armor</p>);
            }
            case ItemType.potion:
            {
                return (<p style={{ color: 'rgb(253, 210, 237)' }}>Potion</p>);
            }
            case ItemType.wondrous:
            {
                return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
            }
        };
    }

    /**
     * @description Renders an instance of this class.
     */
    render()
    {
        /* Keep these as consts because if we were to use a function callback when closing the Modal,
         * that would result in an exception (because we're then in a state that doesn't recognize)
         * ItemShop as 'this'. */
        const hideModal = () => this.setModalVisiblity(false);
        const showModal = () => this.setModalVisiblity(true);
        
        const redRing: IItemDetails = {
            title: 'Ring Jewel Red',
            body: 'Bacon ipsum dolor amet buffalo salami meatball, ribeye sirloin tri-tip pancetta. Doner capicola shankle porchetta drumstick. Chuck tail rump ham buffalo. Leberkas turkey pork loin, pig cow doner kevin landjaeger capicola shankle pork belly flank. Sirloin turkey tenderloin chislic tail spare ribs kielbasa short loin shank burgdoggen. Frankfurter hamburger venison, boudin pork loin turkey salami doner chicken tongue. Turkey ball tip buffalo, ribeye bacon leberkas sirloin cupim short loin venison.',
            iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
            source: SourceTypes.official,
            itemCost: 100,
            type: ItemType.wondrous,
        };

        const greenRing: IItemDetails = {
            title: 'Silver Ring with a Green Jewel',
            body: 'Bacon ipsum dolor amet bacon jowl venison, picanha porchetta salami boudin chicken. Bresaola cow chuck sirloin turducken salami ground round pancetta. Sausage alcatra chislic shankle leberkas bresaola. T-bone venison strip steak corned beef brisket, salami turkey. Kielbasa hamburger brisket pastrami bresaola, beef tail pork chop pork.',
            iconSource: './images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png',
            source: SourceTypes.homebrew,
            itemCost: 1000,
            type: ItemType.armor,
        };

        const itemArray: Array<IItemDetails> = Array(redRing, greenRing);

        return (
            <div className="ItemShop">
                <h1>Item Shop</h1>
                <div className='shopkeeper-area'>
                    <img src='./images/Item_Shop/brazier-lit.gif' />
                    <img src='./images/Item_Shop/shopkeeper.gif' />
                    <img src='./images/Item_Shop/brazier-lit.gif' />
                </div>
                <div className='bazaar-area'>
                    <BazaarCarpet
                        rugBorderSource= "url(/images/Item_Shop/Items/Rings/rug.png)"
                        itemDetails={itemArray}
                        onItemClick={(itemDetails: IItemDetails) => this.onItemClick(itemDetails)}
                    />
                    <BazaarCarpet
                        rugBorderSource="url(/images/Item_Shop/Items/Rings/redrug.png)"
                        itemDetails={itemArray}
                        onItemClick={(itemDetails: IItemDetails) => this.onItemClick(itemDetails)}
                    />
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
                            <div className='item-tag'>
                                {this.getSourceText(this.state.itemDetails.source)}
                            </div>
                            <div className='item-tag'>
                                {`${this.state.itemDetails.itemCost}x`}
                            </div>
                            <div className='item-tag'>
                                {this.getTypeText(this.state.itemDetails.type)}
                            </div>
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
