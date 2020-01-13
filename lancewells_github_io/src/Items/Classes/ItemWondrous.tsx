import React from 'react';
import { IItemJson } from '../Interfaces/IItem';
import { Item } from './Item';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export interface IItemWondrousJson extends IItemJson {
}

export class ItemWondrous extends Item implements IItemWondrousJson {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: TItemType = "Wondrous";

    static fromJson(json: IItemWondrousJson): ItemWondrous {
        let item = new ItemWondrous();
        return Object.assign(item, json, {
        });
    }
}

export function IItemIsItemWondrous(item: IItemJson): item is ItemWondrous {
    var isType: boolean = true;

    isType = isType && (item as ItemWondrous).type === "Wondrous";

    return isType;
}
