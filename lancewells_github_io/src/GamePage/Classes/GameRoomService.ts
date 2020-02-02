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

        var successfullyJoined: boolean = false;

        // First, try to join the game room.
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

        // Afterwards, see if we can get the game room; provided that we joined, that is.
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
                // TODO
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

        var descriptors = Object.getOwnPropertyDescriptors(roomCharData)
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
}