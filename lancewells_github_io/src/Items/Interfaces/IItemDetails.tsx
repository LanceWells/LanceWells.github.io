import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export interface IItemDetails {
    title: string;
    body: string;
    iconSource: string;
    source: TSourceType;
    itemCost: number;
    type: TItemType;
}
