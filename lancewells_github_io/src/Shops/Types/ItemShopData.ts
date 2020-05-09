import { IItem } from '../../ItemData/Interfaces/IItem';
import { ShopKeepers } from './ShopKeepers';

/**
 * A type used to represent an individual shop tab that is visible for any given player. The DM uses this
 * information to know which shops have been created, and which shops are visible. Players use this info
 * to display those shops that are visible to them.
 */
export type ItemShopData = {
    ID: string;
    Name: string;
    ShopKeeper: ShopKeepers;
    Items: IItem[];
}
