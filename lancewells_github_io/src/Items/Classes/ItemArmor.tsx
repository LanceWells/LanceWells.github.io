import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export class ItemArmor implements IItem {
    public title: string = "";
    public body: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public armorBonus: number = 0;
    public addDex: boolean = true;
    public stealthDisadvantage: boolean = false;
    public readonly type: TItemType = "Armor";
}
