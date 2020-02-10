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
                await gameRef.once("value")
                .then(resolved => {
                    console.log("Got game room: " + resolved);
                    gameRoom = GameRoomService.GetPlayerRoom(roomId, resolved);
                })
                .catch(reason => {
                    console.error("Failed to get game room: " + reason);
                });
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

        await gameRef.once('value')
            .then(resolved => {
                console.log("Got game room: " + resolved);

                if (roomType == "DM") {
                    gameRoom = this.GetDMRoom(roomId, resolved);
                }
                else if (roomType == "Player") {
                    gameRoom = this.GetPlayerRoom(roomId, resolved);
                }
            })
            .catch(reason => {
                console.error("Failed to get game room: " + reason);
            });

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

    // public static async FetchShops(roomId: string): Promise<TShopTab[]> {
    //     var gamesRef = firebase.database().ref('Games/' + roomId + '/Shops/');
    //     var shops: TShopTab[] = [];

    //     await gamesRef.once('value')
    //     .then(response => {
    //         console.log("Got shops for game room.\n" + response);
    //         if (response.val()) {
    //             console.log(response.val());

    //         }
    //     })
    //     .catch(reason => {
    //         console.error("Failed to get shops for game room.\n" + reason);
    //     })

    //     return shops;
    // }

    /**
     * Interprets a response from the realtime database about a game room into an object that can be read
     * and manipulated in memory.
     * @param roomId The ID of the room that is being evaluated. Note that this isn't queried, just used
     * to create a game room response.
     * @param snapshot The snapshot of the data that will be interpreted into a game room object.
     */
    private static GetPlayerRoom(roomId: string, snapshot: firebase.database.DataSnapshot): PlayerGameRoom | undefined {
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
    private static GetDMRoom(roomId: string, snapshot: firebase.database.DataSnapshot): DMGameRoom | undefined {
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
            // The second item should be the character data.
            var charDataObject = d[1];
            if (charDataObject
                && charDataObject !== undefined
                && charDataObject.value
                && charDataObject.value !== undefined) {
                var charDisplay: TCharacterDisplay = {
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

    private static GetShopDataFromRoom(shopData: any): TShopTab[] {
        var shops: TShopTab[] = [];
        var descriptors = Object.getOwnPropertyDescriptors(shopData);
        
        // Each descriptor should be a different shop.
        Object.entries(descriptors).map(d => {
            console.log(d);
            
            var newShop: TShopTab = {
                ID: "",
                Name: "",
                ShopKeeper: "Indigo",
                Items: []
            };

            // The first item should be a shop ID.
            var shopId = d[0];
            if (shopId !== null && shopId !== undefined) {

                newShop.ID = shopId
            }

            // The second item sohuld be the individual shop's data.
            // We have to grab each item individually because we store a JSON-ified array of a complex data
            // type in here. If we try to do an Object.Assign, it leaves us with assigning a string to the
            // complex array.
            var shopDataObject = d[1];
            if (shopDataObject 
                && shopDataObject !== undefined
                && shopDataObject.value
                && shopDataObject.value !== undefined) {
                
                // Try to get the name if we can.
                if (shopDataObject.value.Name
                    && shopDataObject.value.Name !== undefined) {
                    newShop.Name = shopDataObject.value.Name;
                }

                // And the shopkeeper.
                if (shopDataObject.value.ShopKeeper
                    && shopDataObject.value.ShopKeeper !== undefined) {
                    newShop.ShopKeeper = shopDataObject.value.ShopKeeper;
                }

                // Now, see if we can deserialize the list of items.
                if (shopDataObject.value.Items
                    && shopDataObject.value.Items !== undefined) {

                    var parsedItems: IItemKey[] = JSON.parse(shopDataObject.value.Items);
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

                shops.push(newShop);
            }
        });

        return shops;
    }
}
