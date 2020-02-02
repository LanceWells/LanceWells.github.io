import { TShopTab } from "./TShopTab";
import { TChestTab } from "./TChestTab";

/**
 * Information about a given player. The DM uses this object rather than the Character Display type. This
 * contains more information about a given player, including their UID which a DM can utilize to add
 * shops or chests to a specific player's game room display.
 */
export type TPlayerInfo = {
    Uid: string;
    Name: string;
    ShopTabs: TShopTab[];
    ChestTabs: TChestTab[];
}
