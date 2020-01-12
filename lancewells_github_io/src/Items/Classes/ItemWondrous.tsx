import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export class ItemWondrous implements IItem {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: TItemType = "Wondrous";
}

export function IItemIsItemWondrous(item: IItem): item is ItemWondrous {
    var isType: boolean = true;

    isType = isType && (item as ItemWondrous).type === "Wondrous";

    return isType;
}
