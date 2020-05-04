import { IItemKey } from './IItemKey'
import { SourceType } from "../Enums/SourceType";
import { ItemModifications } from "../Enums/ItemModifications";

export interface IItemJson extends IItemKey {
    title: string;
    description: string;
    details: string;
    iconSource: string;
    source: SourceType;
    itemCost: number;
    requiresAttunement: boolean;
    modifications: ItemModifications[];
}
