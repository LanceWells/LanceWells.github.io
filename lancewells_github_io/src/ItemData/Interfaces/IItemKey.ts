import { ItemType } from "../Enums/ItemType";
import { ItemAdjustments } from "../Types/ItemAdjustments";

export interface IItemKey {
    key: string;
    readonly type: ItemType;
    adjustments: ItemAdjustments;
}
