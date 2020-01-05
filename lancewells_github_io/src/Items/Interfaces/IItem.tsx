import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export interface IItem {
    key: string;
    title: string;
    body: string;
    iconSource: string;
    source: TSourceType;
    itemCost: number;
    readonly type: TItemType;
}
