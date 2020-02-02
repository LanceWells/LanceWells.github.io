import firebase from 'firebase';
import { IGameRoom } from '../Interfaces/IGameRoom';
import { IDMProfile } from '../Interfaces/IDMProfile';
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
     * Gets information about the specified game room.
     * @param roomId The ID for the room that needs to be fetched from the realtime database.
     */
    public static async GetGameRoom(roomId: string, roomType: TUserProfileType): Promise<IGameRoom | undefined> {
        // TODO: Add listeners for the room data here? --> do in a different call, actually.
        var gameRoom: IGameRoom | undefined = undefined;

        var uid = UserDataAuth.GetInstance().GetUid();
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
            })

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
                // TODO
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
                // TODO
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
}