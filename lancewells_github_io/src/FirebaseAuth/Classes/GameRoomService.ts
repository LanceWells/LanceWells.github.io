// import firebase from 'firebase';
import { firestore } from 'firebase';
import { IItemKey } from '../../ItemData/Interfaces/IItemKey';
import { ItemShopData } from '../../Shops/Types/ItemShopData';
import { ChestData } from '../../Chests/Types/ChestData';
import { ShopKeepers } from '../../Shops/Types/ShopKeepers';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { DnDConstants } from '../../Utilities/Classes/DndConstants';
import { ChestTypes } from '../../Chests/Enums/ChestTypes';

/**
 * A class used to handle game room creation and handling with the firebase realtime database. Note that
 * use of this class makes an assumption that the database has been connnected to already, and that the
 * user has already been authorized.
 */
export class GameRoomService {
    private static readonly collection_userWritable: string = "userWritable";
    private static readonly document_itemStorage: string = "itemStorage";
    private static readonly collection_shops: string = "shops";
    private static readonly collection_chests: string = "chests";

    private static ShopDataConverter: firestore.FirestoreDataConverter<ItemShopData> = {
        toFirestore: (shopData: ItemShopData): firestore.DocumentData => {
            let itemKeys: IItemKey[] = DnDConstants.GetItemsAsFreshKeys(shopData.Items);
            let itemStrings: string[] = itemKeys.map(i => JSON.stringify(i as IItemKey));

            return {
                Items: itemStrings,
                Name: shopData.Name,
                ShopKeeper: shopData.ShopKeeper,
            }
        },
        fromFirestore: (snapshot, options): ItemShopData => {
            let snapshotData = snapshot.data(options);

            let items: string[] = snapshotData.Items;
            let name: string = snapshotData.Name;
            let shopKeeper: string = snapshotData.ShopKeeper;

            // Default to a standard shopkeeper in the event we don't understand what's stored in the DB.
            let translatedShopkeeper: ShopKeepers = ShopKeepers.Indigo
            if (shopKeeper as ShopKeepers) {
                translatedShopkeeper = shopKeeper as ShopKeepers;
            }

            let translatedItems: IItem[] = items
                .map(i => GameRoomService.ConvertStoredItemToItem(i))
                .filter(i => i !== undefined) as IItem[];

            let playerData: ItemShopData = {
                ID: snapshot.id,
                Name: name,
                ShopKeeper: translatedShopkeeper,
                Items: translatedItems
            };

            return playerData;
        }
    }

    private static ChestDataConverter: firestore.FirestoreDataConverter<ChestData> = {
        toFirestore: (chestData: ChestData): firestore.DocumentData => {
            let itemKeys: IItemKey[] = DnDConstants.GetItemsAsFreshKeys(chestData.Items);
            let itemStrings: string[] = itemKeys.map(i => JSON.stringify(i as IItemKey));

            return {
                Items: itemStrings,
                Name: chestData.Name,
                ChestType: chestData.ChestType,
                CopperInChest: chestData.CopperInChest
            }
        },
        fromFirestore: (snapshot, options): ChestData => {
            let snapshotData = snapshot.data(options);

            let items: string[] = snapshotData.Items;
            let name: string = snapshotData.Name;
            let copper: number = snapshotData.CopperInChest;
            let typeOfChest: string = snapshotData.ChestType;

            // Default to a standard shopkeeper in the event we don't understand what's stored in the DB.
            let translatedChestType: ChestTypes = ChestTypes.Wooden;
            if (typeOfChest as ChestTypes) {
                translatedChestType = typeOfChest as ChestTypes;
            }

            let translatedItems: IItem[] = items
                .map(i => GameRoomService.ConvertStoredItemToItem(i))
                .filter(i => i !== undefined) as IItem[];

            let playerData: ChestData = {
                ID: snapshot.id,
                Name: name,
                ChestType: translatedChestType,
                Items: translatedItems,
                CopperInChest: copper
            };

            return playerData;
        }
    }

    private static ConvertStoredItemToItem(itemStr: string): IItem | undefined {
        let convertedItem: IItem | undefined = undefined;

        try {
            let parsedObj: any = JSON.parse(itemStr);
            let emptyItemKey: IItemKey =
            {
                key: "",
                type: ItemType.Wondrous,
                adjustments:
                {
                    magicBonus: 0,
                    isAttuned: false,
                    notes: ""
                }
            };

            let createdItemKey: IItemKey = Object.assign(emptyItemKey, parsedObj) as IItemKey;
            convertedItem = ItemSource.GetItem(createdItemKey);
        }
        catch {
            console.error("Invalid item data stored in shop!");
        }

        return convertedItem;
    }

    /**
     * Adds a new shop to the current game room.
     * @param shop The shop details that will be added. The ID for this will be modified and returned.
     */
    public static async CreateShop(shop: ItemShopData): Promise<ItemShopData> {
        let updatedShopTab: ItemShopData = shop;
        console.log("FIREBASE: Create shop.");

        await firestore()
            .collection(this.collection_userWritable)
            .doc(this.document_itemStorage)
            .collection(this.collection_shops)
            .withConverter(GameRoomService.ShopDataConverter)
            .add(shop)
            .then(response => {
                if (response && response.id) {
                    updatedShopTab.ID = response.id;
                }
            })
            .catch(reason => {
                console.error(reason);
            });

        return updatedShopTab;
    }

    public static async GetShopByShopId(shopId: string): Promise<ItemShopData | undefined> {
        let response: ItemShopData | undefined = undefined;
        console.log("FIREBASE: Get shop.");

        await firestore()
            .collection(this.collection_userWritable)
            .doc(this.document_itemStorage)
            .collection(this.collection_shops)
            .doc(shopId)
            .withConverter(GameRoomService.ShopDataConverter)
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    response = docSnapshot.data();
                }
                else {
                    console.error(`Could not find shop data for id ${shopId}`);
                }
            })
            .catch(error => {
                console.error(error);
            });

        return response;
    }

    /**
    * Adds a new chest.
    * @param chest The chest details that will be added. The ID for this will be modified and returned.
    */
    public static async CreateChest(chest: ChestData): Promise<ChestData> {
        let updatedChestTab: ChestData = chest;
        console.log("FIREBASE: Create shop.");

        await firestore()
            .collection(this.collection_userWritable)
            .doc(this.document_itemStorage)
            .collection(this.collection_chests)
            .withConverter(GameRoomService.ChestDataConverter)
            .add(chest)
            .then(response => {
                if (response && response.id) {
                    updatedChestTab.ID = response.id;
                }
            })
            .catch(reason => {
                console.error(reason);
            });

        return updatedChestTab;
    }

    public static async GetChestByChestId(chestId: string): Promise<ChestData | undefined> {
        let response: ChestData | undefined = undefined;
        console.log("FIREBASE: Get shop.");

        await firestore()
            .collection(this.collection_userWritable)
            .doc(this.document_itemStorage)
            .collection(this.collection_chests)
            .doc(chestId)
            .withConverter(GameRoomService.ChestDataConverter)
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    response = docSnapshot.data();
                }
                else {
                    console.error(`Could not find shop data for id ${chestId}`);
                }
            })
            .catch(error => {
                console.error(error);
            });

        return response;
    }
}
