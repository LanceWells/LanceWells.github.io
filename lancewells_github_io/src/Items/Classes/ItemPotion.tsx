import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export class ItemPotion implements IItem {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public requiresAttunement: boolean = false;
    public withdrawalEffect: boolean = false;
    public readonly type: TItemType = "Potion";
}

export function IItemIsItemPotion(item: IItem): item is ItemPotion {
    var isType: boolean = true;

    isType = isType && (item as ItemPotion).type === "Potion";

    return isType;
}
