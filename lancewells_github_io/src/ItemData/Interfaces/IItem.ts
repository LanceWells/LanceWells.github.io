import { SourceType } from "../Enums/SourceType";
import { ItemType } from "../Enums/ItemType";
import { ItemModifications } from "../Enums/ItemModifications";

export interface IItemKey {
    key: string;
    readonly type: ItemType;
}

export interface IItemJson extends IItemKey{
    title: string;
    description: string;
    details: string;
    iconSource: string;
    source: SourceType;
    itemCost: number;
    requiresAttunement: boolean;
    modifications: ItemModifications[];
}

export interface IItem extends IItemJson {
    RenderItemDescription(): JSX.Element;
    GetEqualityString(): string;
}
