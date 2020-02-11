import { TShopTab } from "./TShopTab";
import { TChestTab } from "./TChestTab";
import { TCharacterDisplay } from "./TCharacterDisplay";

/**
 * Information about a given player. The DM uses this object rather than the Character Display type. This
 * contains more information about a given player, including their UID which a DM can utilize to add
 * shops or chests to a specific player's game room display.
 */
export type TPlayerInfo = {
    Character: TCharacterDisplay;
    ShopTabs: TShopTab[];
    ChestTabs: TChestTab[];
}
