import firebase from 'firebase';
import { IGameRoom } from '../Interfaces/IGameRoom';
import { UserDataAuth } from '../../Login/Classes/UserDataAuth';
import { DMGameRoom } from './DMGameRoom';
import { PlayerGameRoom } from './PlayerGameRoom';
import { TUserProfileType } from '../Types/TUserProfileType';
import { TCharacterDisplay } from '../Types/TCharacterDisplay';
import { TRoomDecor } from '../Types/TRoomDecor';
import { TShopTab } from '../Types/TShopTab';
import { TChestTab } from '../Types/TChestTab';
import { TPlayerInfo } from '../Types/TPlayerInfo';
import { IItemJson, IItemKey, IItem } from '../../Items/Interfaces/IItem';
import { ItemSource } from '../../Items/Classes/ItemSource';

/**
 * A class used to handle game room creation and handling with the firebase realtime database. Note that
 * use of this class makes an assumption that the database has been connnected to already, and that the
 * user has already been authorized.
 */
export class GameRoomService {
    /**
     * Creates a new game room with the specified name. Will return a created DM game room if the call
     * to create the room was successful; otherwise undefined.
     * @param roomName The name of the room to create.
     */
    public static async MakeGameRoom(roomName: string): Promise<DMGameRoom | undefined> {
        var gameRoom: DMGameRoom | undefined = undefined;

        var uid = UserDataAuth.GetInstance().GetUid();
        var gamesRef = firebase.database().ref('Games/');

        await gamesRef.push({
            Name: roomName,
            DM: uid
        })
        .then(response => {
            var pushResponse: firebase.database.Reference = response;
            console.log("Successfully made a game room." + response);

            if (pushResponse.key) {
                gameRoom = {
                    RoomId: pushResponse.key,
                    RoomName: roomName,
                    GameRoomDecor: "None",
                    Characters: [],
                    PlayerInfo: [],
                    Shops: [],
                    Chests: []
                }
            }
        })
        .catch(reason => {
            console.error("Failed to make a game room." + reason);
        });

        return gameRoom;
    }

    /**
     * Joins the specified game room. Returns the game room if it was joined without error; otherwise
     * returns undefined.
     * @param roomId The ID of the room to join.
     */
    public static async JoinGameRoom(roomId: string, playerName: string): Promise<PlayerGameRoom | undefined> {
        var uid = UserDataAuth.GetInstance().GetUid();
        var gameRoom: PlayerGameRoom | undefined = undefined;

        var gameRef = firebase.database().ref('Games/' + roomId);
        var charRef = firebase.database().ref('Games/' + roomId + '/Characters/' + uid);

        var gameRoomExists: boolean = false;
        var successfullyJoined: boolean = false;

        // Before anything else, check and see that the room exists.
        await gameRef.once('value')
        .then(resolved => {
            console.log("Successfully found a room while joining." + resolved);
            gameRoomExists = resolved.exists();
        })
        .catch(reason => {
            console.error("There was an error trying to find the room to join." + reason);
        })

        // It exists! Now try to join it.
        if (gameRoomExists) {

            // Try to join the game room.
            await charRef.set({
                Name: playerName
            })
            .then(resolved => {
                console.log("Successfully joined game room." + resolved);
                successfullyJoined = true;
            })
            .catch(reason => {
                console.error("Failed to join game room: " + reason);
                successfullyJoined = false;
            });

            // If we joined, then get the room data again. Techincally we've done this already, but it's
            // much better to get data after our character is an official part of it. Joining a room is
            // also a low-frequency task, so this isn't a major concern.
            if (successfullyJoined) {
                try {
                    var snapshot = await gameRef.once("value")
                    gameRoom = await this.GetPlayerRoom(roomId, snapshot);
                }
                catch (e) {
                    console.error("Failed to join game room.\n" + e);
                }
            }
        }

        return gameRoom;
    }

    /**
     * Gets information about the specified game room.
     * @param roomId The ID for the room that needs to be fetched from the realtime database.
     */
    public static async GetGameRoom(roomId: string, roomType: TUserProfileType): Promise<IGameRoom | undefined> {
        // TODO: Add listeners for the room data here? --> do in a different call, actually.
        var gameRoom: IGameRoom | undefined = undefined;
        var gameRef = firebase.database().ref("Games/" + roomId);

        try {
            var snapshot = await gameRef.once('value');
            if (roomType == "DM") {
                gameRoom = await this.GetDMRoom(roomId, snapshot);
            }
            else if (roomType = "Player") {
                gameRoom = await this.GetPlayerRoom(roomId, snapshot);
            }
        }
        catch (e) {
            console.error("Failed to get game room.\n" + e);
        }

        return gameRoom;
    }

    /**
     * Adds a new shop to the current game room.
     * @param roomId The ID of the room to add a game shop to.
     * @param shop The shop details that will be added. The ID for this will be modified and returned.
     */
    public static async AddShop(roomId: string, shop: TShopTab): Promise<TShopTab> {
        var gamesRef = firebase.database().ref('Games/' + roomId + "/Shops/");
        var updatedShopTab: TShopTab = shop;
        var itemsJson: IItemKey[] = shop.Items.map(i => {
            let minimalItem = {
                key: i.key,
                type: i.type
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
            var pushResponse: firebase.database.Reference = response;

            if (pushResponse.key) {
                updatedShopTab.ID = pushResponse.key;
            }
        })
        .catch(reason => {
            console.error("Failed to create a new shop.\n" + reason);
        });

        return updatedShopTab;
    }

    /**
     * 
     * @param roomId 
     * @param playerId 
     * @param shopId 
     * @reference https://stackoverflow.com/questions/39815117/add-an-item-to-a-list-in-firebase-database
     */
    public static async AddShopToPlayer(roomId: string, playerId: string, shopId: string): Promise<void> {
        var gameRef = firebase.database().ref('Games/' + roomId + '/ShopTabs/' + playerId + "/" + shopId + "/");

        await gameRef.set(true)
        .then(response => {
            console.log("Successfully added a shop to a player.\n" + response);
        })
        .catch(reason => {
            console.error("Failed to add a shop to a player.\n" + reason);
        });
    }

    /**
     * Interprets a response from the realtime database about a game room into an object that can be read
     * and manipulated in memory.
     * @param roomId The ID of the room that is being evaluated. Note that this isn't queried, just used
     * to create a game room response.
     * @param snapshot The snapshot of the data that will be interpreted into a game room object.
     */
    private static async GetPlayerRoom(roomId: string, snapshot: firebase.database.DataSnapshot): Promise<PlayerGameRoom | undefined> {
        var room: PlayerGameRoom | undefined = undefined;

        if (snapshot.val()) {
            console.log(snapshot.val());

            var roomName: string = "";
            var gameRoomDecor: TRoomDecor = "None";
            var characterDisplay: TCharacterDisplay[] = [];
            var shops: TShopTab[] = [];
            var chests: TChestTab[] = [];

            if (snapshot.val().Name) {
                roomName = snapshot.val().Name;
            }
            if (snapshot.val().GameRoomDecor) {
                gameRoomDecor = snapshot.val().GameRoomDecor;
            }
            if (snapshot.val().Characters) {
                characterDisplay = GameRoomService.GetCharDataFromRoom(snapshot.val().Characters);
            }
            if (snapshot.val().Shops) {
                // TODO
            }
            if (snapshot.val().Chests) {
                // TODO
            }

            room = {
                RoomId: roomId,
                RoomName: roomName,
                Characters: characterDisplay,
                GameRoomDecor: gameRoomDecor,
                Shops: shops,
                Chests: chests
            }
        }

        return room;
    }

    /**
     * Interprets a response from the realtime database about a game room into an object that can be read
     * and manipulated in memory.
     * @param roomId The ID of the room that is being evaluated. Note that this isn't queried, just used
     * to create a game room response.
     * @param snapshot The snapshot of the data that will be interpreted into a game room object.
     */
    private static async GetDMRoom(roomId: string, snapshot: firebase.database.DataSnapshot): Promise<DMGameRoom | undefined> {
        var room: DMGameRoom | undefined = undefined;

        if (snapshot.val()) {
            console.log(snapshot.val());

            var roomName: string = ""
            var gameRoomDecor: TRoomDecor = "None";
            var characterDisplay: TCharacterDisplay[] = [];
            var playerInfo: TPlayerInfo[] = [];
            var shops: TShopTab[] = [];
            var chests: TChestTab[] = [];

            if (snapshot.val().Name) {
                roomName = snapshot.val().Name;
            }
            if (snapshot.val().GameRoomDecor) {
                gameRoomDecor = snapshot.val().GameRoomDecor;
            }
            if (snapshot.val().Characters) {
                characterDisplay = GameRoomService.GetCharDataFromRoom(snapshot.val().Characters);
                
                for (let char of characterDisplay) {
                    var playerObject = snapshot.val()
                    var playerShopTabs: TShopTab[] = [];

                    if (playerObject
                        && playerObject !== undefined
                        && playerObject.ShopTabs
                        && playerObject.ShopTabs !== undefined
                        && playerObject.ShopTabs[char.Uid]
                        && playerObject.ShopTabs[char.Uid] !== undefined)
                    {
                        var playerShopTabObjects = playerObject.ShopTabs[char.Uid];
                        playerShopTabs = await this.GetShopDataFromShopId(roomId, playerShopTabObjects);
                    }

                    playerInfo.push({
                        Character: char,
                        ShopTabs: playerShopTabs,
                        ChestTabs: []
                    });
                }
            }
            if (snapshot.val().Shops) {
                shops = GameRoomService.GetShopDataFromRoom(snapshot.val().Shops);
            }
            if (snapshot.val().Chests) {
                // TODO
            }

            room = {
                RoomId: roomId,
                RoomName: roomName,
                GameRoomDecor: gameRoomDecor,
                Characters: characterDisplay,
                PlayerInfo: playerInfo,
                Shops: shops,
                Chests: chests
            }
        }

        return room;
    }

    /**
     * Gets the game room's storage about the list of currently-displayed characters.
     * @param roomCharData The data taken from the snapshot event.
     */
    private static GetCharDataFromRoom(roomCharData: any): TCharacterDisplay[] {
        var charData: TCharacterDisplay[] = [];

        var descriptors = Object.getOwnPropertyDescriptors(roomCharData);
        Object.entries(descriptors).map(d => {
            // The first item should be a user's UID.
            var charDataId = d[0];

            // The second item should be the character data.
            var charDataObject = d[1];
            if (charDataObject
                && charDataObject !== undefined
                && charDataObject.value
                && charDataObject.value !== undefined) {
                var charDisplay: TCharacterDisplay = {
                    Uid: charDataId as string,
                    Name: "",
                    Emotion: "None",
                    Image: []
                };
                Object.assign(charDisplay, charDataObject.value);
                charData.push(charDisplay);
            }
        });

        return charData;
    }

    /**
     * 
     * @param roomId 
     * @param shopId 
     */
    private static async GetShopDataFromShopId(roomId: string, shopId: any): Promise<TShopTab[]> {
        var shops: TShopTab[] = [];
        
        if (shopId && shopId !== undefined) {
            var descriptors = Object.getOwnPropertyDescriptors(shopId);

            var promises = Object.entries(descriptors).map(d => {
                var shop: undefined | TShopTab = undefined;
                var shopId = d[0];

                if (shopId && shopId !== undefined) {
                    var shopRef = firebase.database().ref('Games/' + roomId + '/Shops/' + shopId);
                    
                    return shopRef.once('value')
                    .then(resolved => {
                        var value = resolved.val();
                        shop = this.GetShopFromShopData(value);

                        if (shop !== undefined) {
                            shops.push(shop);
                        }

                        Promise.resolve(resolved);
                    })
                    .catch (reason => {
                        console.error(reason);
                        Promise.resolve(reason);
                    });
                }
            });

            await Promise.all(promises);
        }

        return shops;
    }

    /**
     * Gets the game room's storage about the data for a list of shops. This should work when evaluating
     * all available shops as a DM, or a list of personal shops as a player.
     * @param shopData The list of shop data obtained from a firebase realtime db snapshot.
     */
    private static GetShopDataFromRoom(shopData: any): TShopTab[] {
        var shops: TShopTab[] = [];
        var descriptors = Object.getOwnPropertyDescriptors(shopData);
        
        // Each descriptor should be a different shop.
        Object.entries(descriptors).map(d => {
            console.log(d);

            // The second item should be the individual shop's data.
            var shopDataObject = d[1];

            if (shopDataObject
                && shopDataObject !== undefined
                && shopDataObject.value
                && shopDataObject.value !== undefined)
            {
                var newShop: undefined | TShopTab = this.GetShopFromShopData(shopDataObject.value);
                if (newShop !== undefined) {
                    // The first item should be a shop ID.
                    var shopId = d[0];
                    if (shopId !== null && shopId !== undefined) {
                        newShop.ID = shopId
                    }

                    shops.push(newShop);
                }
            }
        });

        return shops;
    }

    private static GetShopFromShopData(shopDataObject: any): TShopTab | undefined {
        var newShop: TShopTab | undefined;

        newShop = {
            ID: "",
            Name: "",
            ShopKeeper: "Indigo",
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

            var parsedItems: IItemKey[] = JSON.parse(shopDataObject.Items);
            if (parsedItems !== undefined && parsedItems as IItemKey[] != undefined) {

                var providedItems: (IItem | undefined)[] = parsedItems.map(item => {
                    return ItemSource.GetItem(item.key, item.type);
                });

                var definedItems: IItem[] = providedItems
                    .filter(item => item !== undefined)
                    .map(item => item as IItem);

                newShop.Items = definedItems;
            }
        }

        return newShop;
    }
}
