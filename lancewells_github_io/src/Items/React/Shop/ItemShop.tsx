import './ItemShop.css';
import React from 'react';

import { IItemJson, IItem } from "../../Interfaces/IItem";
import { TSourceType } from "../../Types/TSourceType";
import { BazaarCarpet } from './BazaarCarpet';
import { CarpetMaps } from './CarpetMap';
import { ItemWondrous } from '../../Classes/ItemWondrous';
import { TAttack } from '../../Types/TAttack';
import { TItemClick } from '../Common/ItemCard';
import { ItemDetailsModal } from '../Common/ItemDetailsModal';
import { TPurchaseClick } from '../../Types/CardButtonCallbackTypes/TPurchaseClick';
import { ItemSource } from '../../Classes/ItemSource';
import { CharacterState } from '../../Classes/CharacterState';

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
    itemDetails: IItem;
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
    constructor(props: IItemShopProps) {
        super(props);
        this.state = {
            showItemDialog: false,
            itemDetails: new ItemWondrous(),
        };
        // console.log(process.env.REACT_APP_TEST_KEY);
        ItemSource.GetInstance();
    }

    /**
     * @description
     * Shows or hides the item details modal.
     * @param show If true, show the modal; otherwise false.
     */
    setModalVisiblity(show: boolean) {
        this.setState({
            showItemDialog: show,
        });
    }

    /**
     * @description Handles an item click event.
     * @param item The item details that are provided as a result of the click event (this is a set of
     * properties that represent the item that was clicked).
     */
    onItemClick(item: IItem) {
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
    getSourceText(source: TSourceType) {
        switch (source) {
            case "Official":
                {
                    return (<p style={{ color: 'rgb(255, 200, 37)' }}>Official</p>);
                }
            case "Homebrew":
                {
                    return (<p style={{ color: 'rgb(147, 56, 143)' }}>Homebrew</p>);
                }
        };
    }

    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the type
     * of the item that is being displayed.
     * @param type The item to lookup and return a <p> element that represents it.
     */
    getTypeDisplay(item: IItemJson) {
        switch (item.type) {
            case "Weapon":
                {
                    return (<p style={{ color: 'rgb(199, 207, 221)' }}>Weapon</p>);
                }
            case "Armor":
                {
                    return (<p style={{ color: 'rgb(148, 253, 255)' }}>Armor</p>);
                }
            case "Potion":
                {
                    return (<p style={{ color: 'rgb(253, 210, 237)' }}>Potion</p>);
                }
            case "Wondrous":
                {
                    return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
                }
            default:
                {
                    return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
                }
        }
    }

    /**
     * @description Gets a list of bazaar carpets for display.
     * @param onItemClick The click event-handler for item clicks.
     */
    getBazaarCarpets(onItemClick: TItemClick, onItemPurchase: TPurchaseClick) {
        return CarpetMaps.map((carpet) => {
            return (
                <BazaarCarpet
                    onPurchaseClick={onItemPurchase}
                    carpetMap={carpet}
                    onItemClick={onItemClick}
                />
            );
        });
    }

    componentDidMount() {
        CharacterState.GetInstance();
    }

    /**
     * @description Renders an instance of this class.
     */
    render() {
        /* Keep these as consts because if we were to use a function callback when closing the Modal,
         * that would result in an exception (because we're then in a state that doesn't recognize)
         * ItemShop as 'this'. */

        const handleItemClick: TItemClick = (itemDetails: IItem) => this.onItemClick(itemDetails);

        const hideDetailsModal = () => {
            this.setState({
                showItemDialog: false,
            });
        };

        const handlePurchaseItem: TPurchaseClick = (item: IItem) => {
            CharacterState.GetInstance().AddItemToCurrentCharacter(item);
        }

        return (
            <div className="ItemShop">
                <h1>Item Shop</h1>
                <div className='shopkeeper-area'>
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                    <img src='./images/Item_Shop/shopkeeper.gif' alt="shopkeeper" />
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                </div>
                <div className='bazaar-area'>
                    {this.getBazaarCarpets(handleItemClick, handlePurchaseItem)}
                </div>
                <ItemDetailsModal
                    show={this.state.showItemDialog}
                    hideModal={hideDetailsModal}
                    itemDetails={this.state.itemDetails} />
            </div>
        );
    }
}
