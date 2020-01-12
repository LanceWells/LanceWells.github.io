import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export interface IItem {
    key: string;
    title: string;
    description: string;
    details: string;
    iconSource: string;
    source: TSourceType;
    itemCost: number;
    requiresAttunement: boolean;
    readonly type: TItemType;
}
