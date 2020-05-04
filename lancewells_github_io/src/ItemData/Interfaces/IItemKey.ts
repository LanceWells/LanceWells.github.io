import { ItemType } from "../Enums/ItemType";

export interface IItemKey {
    key: string;
    readonly type: ItemType;
}
