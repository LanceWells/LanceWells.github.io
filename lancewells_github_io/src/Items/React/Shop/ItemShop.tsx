import './ItemShop.css';
import React from 'react';

import { IItem } from "../../Interfaces/IItem";
import { BazaarCarpet } from './BazaarCarpet';
import { ItemWondrous } from '../../Classes/ItemWondrous';
import { TItemClick } from '../Common/ItemCard';
import { ItemDetailsModal } from '../Common/ItemDetailsModal';
import { TPurchaseClick } from '../../Types/CardButtonCallbackTypes/TPurchaseClick';
import { ItemSource } from '../../Classes/ItemSource';
import { IPlayerProfile } from '../../../GamePage/Interfaces/IPlayerProfile';
import { CarpetMap, CarpetBorder } from './CarpetMap';

/**
 * @description
 * Describes the properties that are passed into this class.
 */
interface IItemShopProps {
    userProfile: IPlayerProfile;
    purchaseCallback: TPurchaseClick;
    items: IItem[];
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
     * @description Gets a list of bazaar carpets for display.
     * @param onItemClick The click event-handler for item clicks.
     */
    getBazaarCarpets(onItemClick: TItemClick, onItemPurchase: TPurchaseClick): JSX.Element[] {
        var carpetArmorItems     : IItem[] = [];
        var carpetPotionsItems   : IItem[] = [];
        var carpetWeaponsItems   : IItem[] = [];
        var carpetWondrousItems  : IItem[] = [];

        this.props.items.forEach(item => {
            switch(item.type) {
                case "Armor"    : carpetArmorItems.push(item);       break;
                case "Potion"   : carpetPotionsItems.push(item);     break;
                case "Weapon"   : carpetWeaponsItems.push(item);     break;
                case "Wondrous" : carpetWondrousItems.push(item);    break;
                default         : carpetWondrousItems.push(item);    break;
            }
        });

        // It's not the prettiest, but there's an advantage to the JSX method below. It reduces the number
        // of individual objects we have to track the item types. There's already a bit of an overhead to
        // to using a one-to-one mapping from item type to carpet, so this helps mitigate that pain.

        var carpets: JSX.Element[] = [];
        if (carpetArmorItems.length > 0) {
            carpets.push(
                <BazaarCarpet
                    onPurchaseClick={onItemPurchase}
                    carpetMap={new CarpetMap(CarpetBorder.Green, "Armor", carpetArmorItems)}
                    onItemClick={onItemClick}
                />
            )
        }

        if (carpetPotionsItems.length > 0) {
            carpets.push(
                <BazaarCarpet
                    onPurchaseClick={onItemPurchase}
                    carpetMap={new CarpetMap(CarpetBorder.Green, "Consumables", carpetPotionsItems)}
                    onItemClick={onItemClick}
                />
            )
        }

        if (carpetWeaponsItems.length > 0) {
            carpets.push(
                <BazaarCarpet
                    onPurchaseClick={onItemPurchase}
                    carpetMap={new CarpetMap(CarpetBorder.Purple, "Weapons", carpetWeaponsItems)}
                    onItemClick={onItemClick}
                />
            )
        }

        if (carpetWondrousItems.length > 0) {
            carpets.push(
                <BazaarCarpet
                    onPurchaseClick={onItemPurchase}
                    carpetMap={new CarpetMap(CarpetBorder.Blue, "Wondrous Items", carpetWondrousItems)}
                    onItemClick={onItemClick}
                />
            )
        }

        return carpets;
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

        return (
            <div className="ItemShop">
                <h1>Item Shop</h1>
                <div className='shopkeeper-area'>
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                    <img src='./images/Item_Shop/shopkeeper.gif' alt="shopkeeper" />
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                </div>
                <div className='bazaar-area'>
                    {this.getBazaarCarpets(handleItemClick, this.props.purchaseCallback)}
                </div>
                <ItemDetailsModal
                    show={this.state.showItemDialog}
                    hideModal={hideDetailsModal}
                    itemDetails={this.state.itemDetails} />
            </div>
        );
    }
}
