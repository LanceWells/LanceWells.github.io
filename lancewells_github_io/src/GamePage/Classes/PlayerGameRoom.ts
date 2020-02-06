import { IGameRoom } from '../Interfaces/IGameRoom';
import { TRoomDecor } from '../Types/TRoomDecor';
import { TCharacterDisplay } from '../Types/TCharacterDisplay';
import { TShopTab } from '../Types/TShopTab';
import { TChestTab } from '../Types/TChestTab';

export class PlayerGameRoom implements IGameRoom {
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
    GameRoomDecor: TRoomDecor = "None";

    /**
     * A list of characters and their relevant visible media.
     */
    readonly Characters: TCharacterDisplay[] = [];

    /**
     * Includes public (all-user) and personal shop tabs.
     */
    readonly Shops: TShopTab[] = [];

    /**
     * Includes public (all-user) and personal chest tabs.
     */
    readonly Chests: TChestTab[] = [];
}
