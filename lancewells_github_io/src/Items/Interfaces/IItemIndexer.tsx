import { IItem } from "./IItem";

export interface IItemIndexer<T extends IItem> {
    [index: string]: T
}
