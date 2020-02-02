import { IGameRoom } from "../Interfaces/IGameRoom";
import { TRoomDecor } from "../Types/TRoomDecor";
import { TShopTab } from "../Types/TShopTab";
import { TPlayerInfo } from '../Types/TPlayerInfo';
import { TCharacterDisplay } from "../Types/TCharacterDisplay";
import { TChestTab } from "../Types/TChestTab";

export class DMGameRoom implements IGameRoom {
    /**
     * The ID for the room. This won't be accessed much but is vital when telling any room creation
     * callers what we just made.
     */
    readonly RoomId: string = "";

    /**
     * The name of the room. Will be displayed in the room area.
     */
    readonly RoomName: string = "";

    /**
     * Describes any current decorations in the game room display.
     */
    readonly GameRoomDecor: TRoomDecor = "None";

    /**
     * A list of characters and their relevant visible media.
     */
    readonly Characters: TCharacterDisplay[] = [];

    /**
     * A list of information about each player.
     */
    readonly PlayerInfo: TPlayerInfo[] = [];

    /**
     * The list of all available shops in this game room.
     */
    readonly Shops: TShopTab[] = [];

    /**
     * The list of all available chests in this game room.
     */
    readonly Chests: TChestTab[] = [];
}
