import '../ItemShop.css';
import React from 'react';

import { IItem } from "../../ItemData/Interfaces/IItem";
import { BazaarCarpet } from './BazaarCarpet';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { ItemClick } from '../../ItemData/Types/ItemClick';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { PurchaseClick } from '../../ItemData/Types/CardButtonCallbackTypes/PurchaseClick';
import { CarpetMap, CarpetBorder } from './CarpetMap';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { GroupItemsByType } from '../../ItemData/Classes/ItemUtilityFunctions';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ItemShopData } from '../Types/ItemShopData';

/**
 * @description
 * Describes the properties that are passed into this class.
 */
interface IItemShopProps {
    // purchaseCallback: PurchaseClick;
    // items: IItem[];
    shopData: ItemShopData;
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

    private async HandleItemPurchase(item: IItem): Promise<void> {
        let charData: PlayerCharacterData | undefined = await CharacterStateManager.GetInstance().GetCharacter();
        if (charData && charData.Copper >= item.itemCopperCost) {
            charData.Copper -= item.itemCopperCost;
            charData.Items.push(item);

            await CharacterStateManager.GetInstance().ChangeCharacter(charData);
        }
    }

    /**
     * @description Gets a list of bazaar carpets for display.
     * @param onItemClick The click event-handler for item clicks.
     */
    getBazaarCarpets(onItemClick: ItemClick, onItemPurchase: PurchaseClick): JSX.Element[] {
        let carpetMaps: JSX.Element[] = [];
        let organizedItems: Map<ItemType, IItem[]>;
        organizedItems = GroupItemsByType(this.props.shopData.Items);

        // Convert the array into something we can run map() on.
        let mappedKeys: ItemType[] = Array.from(organizedItems.keys());

        mappedKeys.map(itemType => {
            let items: IItem[] | undefined = organizedItems.get(itemType);

            if (items) {
                carpetMaps.push(
                    <BazaarCarpet
                        onPurchaseClick={onItemPurchase}
                        carpetMap={new CarpetMap(CarpetBorder.Green, itemType, items)}
                        onItemClick={onItemClick}
                    />
                );
            }
        });

        return carpetMaps;
        
        // let carpetArmorItems     : IItem[] = [];
        // let carpetPotionsItems   : IItem[] = [];
        // let carpetWeaponsItems   : IItem[] = [];
        // let carpetWondrousItems  : IItem[] = [];

        // this.props.items.forEach(item => {
        //     switch(item.type) {
        //         case ItemType.Armor    : carpetArmorItems.push(item);       break;
        //         case ItemType.Armor   : carpetPotionsItems.push(item);     break;
        //         case ItemType.Weapon   : carpetWeaponsItems.push(item);     break;
        //         case ItemType.Wondrous : carpetWondrousItems.push(item);    break;
        //         default         : carpetWondrousItems.push(item);    break;
        //     }
        // });

        // // It's not the prettiest, but there's an advantage to the JSX method below. It reduces the number
        // // of individual objects we have to track the item types. There's already a bit of an overhead to
        // // to using a one-to-one mapping from item type to carpet, so this helps mitigate that pain.

        // let carpets: JSX.Element[] = [];
        // if (carpetArmorItems.length > 0) {
        //     carpets.push(
        //         <BazaarCarpet
        //             onPurchaseClick={onItemPurchase}
        //             carpetMap={new CarpetMap(CarpetBorder.Green, ItemType.Armor, carpetArmorItems)}
        //             onItemClick={onItemClick}
        //         />
        //     )
        // }

        // if (carpetPotionsItems.length > 0) {
        //     carpets.push(
        //         <BazaarCarpet
        //             onPurchaseClick={onItemPurchase}
        //             carpetMap={new CarpetMap(CarpetBorder.Green, ItemType.Consumable, carpetPotionsItems)}
        //             onItemClick={onItemClick}
        //         />
        //     )
        // }

        // if (carpetWeaponsItems.length > 0) {
        //     carpets.push(
        //         <BazaarCarpet
        //             onPurchaseClick={onItemPurchase}
        //             carpetMap={new CarpetMap(CarpetBorder.Purple, ItemType.Weapon, carpetWeaponsItems)}
        //             onItemClick={onItemClick}
        //         />
        //     )
        // }

        // if (carpetWondrousItems.length > 0) {
        //     carpets.push(
        //         <BazaarCarpet
        //             onPurchaseClick={onItemPurchase}
        //             carpetMap={new CarpetMap(CarpetBorder.Blue, ItemType.Wondrous, carpetWondrousItems)}
        //             onItemClick={onItemClick}
        //         />
        //     )
        // }

        // return carpets;
    }

    /**
     * @description Renders an instance of this class.
     */
    render() {
        /* Keep these as consts because if we were to use a function callback when closing the Modal,
         * that would result in an exception (because we're then in a state that doesn't recognize)
         * ItemShop as 'this'. */

        const handleItemClick: ItemClick = (itemDetails: IItem) => this.onItemClick(itemDetails);

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
                    {this.getBazaarCarpets(handleItemClick, this.HandleItemPurchase.bind(this))}
                </div>
                <ItemDetailsModal
                    show={this.state.showItemDialog}
                    hideModal={hideDetailsModal}
                    itemDetails={this.state.itemDetails} />
            </div>
        );
    }
}
