import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";
import { TItemModifications } from "../Types/TCardModifications";

export interface IItemKey {
    key: string;
    readonly type: TItemType;
}

export interface IItemJson extends IItemKey{
    title: string;
    description: string;
    details: string;
    iconSource: string;
    source: TSourceType;
    itemCost: number;
    requiresAttunement: boolean;
    modifications: TItemModifications[];
}

export interface IItem extends IItemJson {
    RenderItemDescription(): JSX.Element;
    GetEqualityString(): string;
}
