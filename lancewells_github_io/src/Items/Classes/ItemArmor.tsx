import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export class ItemArmor implements IItem {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public armorBonus: number = 0;
    public addDex: boolean = true;
    public stealthDisadvantage: boolean = false;
    public readonly type: TItemType = "Armor";
}

export function IItemIsItemArmor(item: IItem) : item is ItemArmor {
    var isType: boolean = true;

    isType = isType && (item as ItemArmor).type === "Armor";
    isType = isType && (item as ItemArmor).addDex != undefined;
    isType = isType && (item as ItemArmor).stealthDisadvantage != undefined;

    return isType;
}
