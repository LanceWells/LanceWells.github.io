import { TItemType } from "./TItemType";

export type TInventoryModel =
    {
        characterName: string;
        items: { [key: string]: string[] }
    };
