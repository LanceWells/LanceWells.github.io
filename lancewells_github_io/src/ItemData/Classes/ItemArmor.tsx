import { IItemJson } from '../Interfaces/IItemJson';
import { Item } from './Item';
import { SourceType } from "../Enums/SourceType";
import { ItemType } from "../Enums/ItemType";

export interface IItemArmorJson extends IItemJson {
    armorBonus: number;
    addDex: boolean;
    stealthDisadvantage: boolean;
}

export class ItemArmor extends Item implements IItemArmorJson {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: SourceType = SourceType.Homebrew;
    public itemCopperCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: ItemType = ItemType.Armor;

    public armorBonus: number = 0;
    public addDex: boolean = true;
    public stealthDisadvantage: boolean = false;

    static fromJson(json: IItemArmorJson): ItemArmor {
        let item = new ItemArmor();
        return Object.assign(item, json, {
        });
    }
}

export function IItemIsItemArmor(item: IItemJson) : item is ItemArmor {
    let isType: boolean = true;

    isType = isType && (item as ItemArmor).type === ItemType.Armor;
    isType = isType && (item as ItemArmor).addDex !== undefined;
    isType = isType && (item as ItemArmor).stealthDisadvantage !== undefined;

    return isType;
}
