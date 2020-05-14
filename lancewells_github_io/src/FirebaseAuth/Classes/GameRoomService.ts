import firebase from 'firebase';
import { IItemKey } from '../../ItemData/Interfaces/IItemKey';
import { ItemShopData } from '../../Shops/Types/ItemShopData';
import { ShopKeepers } from '../../Shops/Types/ShopKeepers';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemSource } from '../../ItemData/Classes/ItemSource';

/**
 * A class used to handle game room creation and handling with the firebase realtime database. Note that
 * use of this class makes an assumption that the database has been connnected to already, and that the
 * user has already been authorized.
 */
export class GameRoomService {
    /**
     * Adds a new shop to the current game room.
     * @param shop The shop details that will be added. The ID for this will be modified and returned.
     */
    public static async AddShop(shop: ItemShopData): Promise<ItemShopData> {
        let gamesRef = firebase.database().ref("Shops/");
        let updatedShopTab: ItemShopData = shop;

        // Just make new item keys for each item. Otherwise we end up with a ton of useless data in the
        // database store.
        let itemsJson: IItemKey[] = shop.Items.map(i => {
            let minimalItem = {
                key: i.key,
                type: i.type,
                adjustments: i.adjustments
            }
            return minimalItem;
        });
        
        await gamesRef.push({
            Name: shop.Name,
            ShopKeeper: shop.ShopKeeper,
            Items: JSON.stringify(itemsJson)
        })
        .then(response => {
            console.log("Successfully added a new shop.\n" + response);
            let pushResponse: firebase.database.Reference = response;

            if (pushResponse.key) {
                updatedShopTab.ID = pushResponse.key;
            }
        })
        .catch(reason => {
            console.error("Failed to create a new shop.\n" + reason);
        });

        return updatedShopTab;
    }

    public static async GetShopByShopId(shopId: string): Promise<ItemShopData | undefined> {
        let shopRef = firebase.database().ref('Shops/' + shopId);
        let foundShop: ItemShopData | undefined = undefined;

        await shopRef.once('value')
            .then(resolved => {
                let value: any = resolved.val();
                let shop: ItemShopData | undefined = this.GetShopFromShopData(value);

                if (shop !== undefined) {
                    foundShop = shop;
                }
            })
            .catch(reason => {
                console.error(reason);
            });

        return foundShop;
    }

    private static GetShopFromShopData(shopDataObject: any): ItemShopData | undefined {
        let newShop: ItemShopData | undefined;

        newShop = {
            ID: "",
            Name: "",
            ShopKeeper: ShopKeepers.Indigo,
            Items: []
        };

        // Try to get the name if we can.
        if (shopDataObject.Name
            && shopDataObject.Name !== undefined) {
            newShop.Name = shopDataObject.Name;
        }

        // And the shopkeeper.
        if (shopDataObject.ShopKeeper
            && shopDataObject.ShopKeeper !== undefined) {
            newShop.ShopKeeper = shopDataObject.ShopKeeper;
        }

        // Now, see if we can deserialize the list of items.
        if (shopDataObject.Items
            && shopDataObject.Items !== undefined) {

            let parsedItems: IItemKey[] = JSON.parse(shopDataObject.Items);
            if (parsedItems !== undefined && parsedItems as IItemKey[] != undefined) {

                let providedItems: (IItem | undefined)[] = parsedItems.map(item => {
                    let mappedItem: IItem | undefined = ItemSource.GetItem(item);

                    // A shop/chest might specify some additional features for this item. By default, we're
                    // just looking for the item from the item source. Apply some after-the-fact adjustments
                    // if the item was found.
                    if (mappedItem && item && item.adjustments) {
                        mappedItem.adjustments = item.adjustments;
                    }
                    return mappedItem;
                });

                let definedItems: IItem[] = providedItems
                    .filter(item => item !== undefined)
                    .map(item => item as IItem);

                newShop.Items = definedItems;
            }
        }

        return newShop;
    }
}
