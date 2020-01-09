import { TItemType } from "./TItemType";

export type TInventoryModel =
    {
        characterName: string;
        // armorKeys: Array<string>;
        // // weaponKeys: Array<string>;
        // potionKeys: Array<string>;
        // wondrousKeys: Array<string>;
        items: { [key: string]: string[] }
    };
