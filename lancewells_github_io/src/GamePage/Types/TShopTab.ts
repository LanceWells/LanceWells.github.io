import { IItem } from '../../Items/Interfaces/IItem';
import { TShopKeepers } from './TShopKeepers';

/**
 * A type used to represent an individual shop tab that is visible for any given player. The DM uses this
 * information to know which shops have been created, and which shops are visible. Players use this info
 * to display those shops that are visible to them.
 */
export type TShopTab = {
    ID: string;
    Name: string;
    ShopKeeper: TShopKeepers;
    Items: IItem[];
}
