import { IItemJson } from '../Interfaces/IItemJson';
import { Item } from './Item';
import { SourceType } from "../Enums/SourceType";
import { ItemType } from "../Enums/ItemType";
import { CarpetBorder } from '../../Shops/Enums/CarpetBorder';

export interface IItemWondrousJson extends IItemJson {
}

export class ItemWondrous extends Item implements IItemWondrousJson {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: SourceType = SourceType.Homebrew;
    public itemCopperCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: ItemType = ItemType.Wondrous;

    static fromJson(json: IItemWondrousJson): ItemWondrous {
        let item = new ItemWondrous();
        return Object.assign(item, json, {
        });
    }

    public GetCarpetType(): CarpetBorder { return CarpetBorder.Purple }
}

export function IItemIsItemWondrous(item: IItemJson): item is ItemWondrous {
    let isType: boolean = true;

    isType = isType && (item as ItemWondrous).type === ItemType.Wondrous;

    return isType;
}
