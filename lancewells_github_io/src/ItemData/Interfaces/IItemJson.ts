import { IItemKey } from './IItemKey'
import { SourceType } from "../Enums/SourceType";

export interface IItemJson extends IItemKey {
    title: string;
    description: string;
    details: string;
    iconSource: string;
    source: SourceType;
    itemCopperCost: number;
    requiresAttunement: boolean;
}
