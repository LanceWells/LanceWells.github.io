import React from 'react';
import { IItemJson } from '../Interfaces/IItem';
import { Item } from './Item';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

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
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: TItemType = "Armor";

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
    var isType: boolean = true;

    isType = isType && (item as ItemArmor).type === "Armor";
    isType = isType && (item as ItemArmor).addDex != undefined;
    isType = isType && (item as ItemArmor).stealthDisadvantage != undefined;

    return isType;
}
