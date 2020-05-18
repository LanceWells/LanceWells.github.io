import '../ItemShop.css';
import React from 'react';

import { IItem } from "../../ItemData/Interfaces/IItem";
import { BazaarCarpet } from './BazaarCarpet';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { PurchaseClick } from '../../ItemData/Types/CardButtonCallbackTypes/PurchaseClick';
import { CarpetMap } from './CarpetMap';
import { CarpetBorder } from '../Enums/CarpetBorder';
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
    shopData: ItemShopData;
    charData: PlayerCharacterData | undefined;
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
     * @description Handles an item click event.
     * @param item The item details that are provided as a result of the click event (this is a set of
     * properties that represent the item that was clicked).
     */
    onItemClick(item: IItem) {
        this.setState({
            itemDetails: item,
            showItemDialog: true
        });
    }

    onItemDialogClose() {
        this.setState({
            showItemDialog: false
        });
    }

    private async HandleItemPurchase(item: IItem): Promise<void> {
        if (this.props.charData) {
            if (this.props.charData.Copper >= item.itemCopperCost) {
                this.props.charData.Copper -= item.itemCopperCost;
                this.props.charData.Items.push(item);

                await CharacterStateManager.GetInstance().UploadCharacterData(this.props.charData);
            }
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

        mappedKeys.forEach(itemType => {
            let items: IItem[] | undefined = organizedItems.get(itemType);

            if (items && items.length > 0) {
                // We intentionally organized these by item type. Assume that if we grab just the first item's
                // carpet value, that applies to the rest.
                let carpetType: CarpetBorder = items[0].GetCarpetType();

                carpetMaps.push(
                    <BazaarCarpet
                        onPurchaseClick={onItemPurchase}
                        carpetMap={new CarpetMap(carpetType, itemType, items)}
                        onItemClick={onItemClick}
                        availablePlayerCopper={this.props.charData?.Copper}
                    />
                );
            }
        });

        return carpetMaps;
    }

    /**
     * @description Renders an instance of this class.
     */
    render() {
        return (
            <div className="ItemShop">
                <h1>{this.props.shopData.Name}</h1>
                <div className='shopkeeper-area'>
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                    <img src='./images/Item_Shop/shopkeeper.gif' alt="shopkeeper" />
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                </div>
                <div className='bazaar-area'>
                    {this.getBazaarCarpets(this.onItemClick.bind(this), this.HandleItemPurchase.bind(this))}
                </div>
                <ItemDetailsModal
                    show={this.state.showItemDialog}
                    hideModal={this.onItemDialogClose.bind(this)}
                    itemDetails={this.state.itemDetails}
                    removeCallback={undefined}
                    handleUpdatedItemNotes={undefined}
                    />
            </div>
        );
    }
}
