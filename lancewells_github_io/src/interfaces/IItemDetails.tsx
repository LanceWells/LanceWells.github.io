export type ItemType = "Weapon" | "Armor" | "Potion" | "Wondrous";
export type SourceType = "Official" | "Homebrew";

export interface IItemDetails {
    title: string;
    body: string;
    iconSource: string;
    source: SourceType;
    itemCost: number;
    type: ItemType;
}

export interface IItemIndexer {
    [index: string] : IItemDetails
}
