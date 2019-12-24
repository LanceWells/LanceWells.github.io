import { IItemDetails } from "./interfaces/IItemDetails";
import { SourceTypes } from "./enums/SourceTypes";
import { ItemType } from "./enums/ItemType";

export type CarpetMap = {
    itemDetails: Array<IItemDetails>;
    rugBorderSource: string;
}

/**********************************************************************************************************
 * Rings
 *********************************************************************************************************/
const redRing: IItemDetails = {
    title: 'Firey Ring',
    body: 'A golden ring with a ruby fastened to its exterior. The ring is warm to the touch. Grants the bearer access to the Fire Bolt cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
    iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
    source: SourceTypes.homebrew,
    itemCost: 100,
    type: ItemType.wondrous,
};

const greenRing: IItemDetails = {
    title: 'Frigid Ring',
    body: 'A silver ring with a sapphire fastened to its exterior. The ring is cold to the touch. Grants the bearer access to the Ray of Frost cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
    iconSource: './images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png',
    source: SourceTypes.homebrew,
    itemCost: 100,
    type: ItemType.wondrous,
};
/**********************************************************************************************************
 * Weapons
 *********************************************************************************************************/
const weapon_spear: IItemDetails = {
    title: 'Spear',
    body: 'A long, pointed weapon. Attacks with this weapon deal 1d6 piercing damage. [Properties: Thrown (range 20/60), Versatile (1d8)]',
    iconSource: './images/Item_Shop/Items/Weapons/spear.png',
    source: SourceTypes.official,
    itemCost: 1,
    type: ItemType.weapon,
};

const weapon_longsword: IItemDetails = {
    title: 'Longsword',
    body: 'A long blade. Attacks with this weapon deal 1d8 slashing damage. [Properties: Versatile (1d10)]',
    iconSource: './images/Item_Shop/Items/Weapons/longsword.png',
    source: SourceTypes.official,
    itemCost: 15,
    type: ItemType.weapon,
};

const weapon_shortsword: IItemDetails = {
    title: 'Shortsword',
    body: 'A short, pointed weapon. Attacks with this weapon deal 1d6 piercing damage. [Properties: Finesse, Light]',
    iconSource: './images/Item_Shop/Items/Weapons/shortsword.png',
    source: SourceTypes.official,
    itemCost: 10,
    type: ItemType.weapon,
};

const weapon_snake_staff: IItemDetails = {
    title: 'Snake Staff',
    body: 'A long oaken staff. The staff is wrapped by the likeness of a clay snake. Attacks with this weapon deal 1d4 bludgeoning damage and 1d4 poison damage.',
    iconSource: './images/Item_Shop/Items/Weapons/Cleric Staff Snake Green.png',
    source: SourceTypes.homebrew,
    itemCost: 100,
    type: ItemType.weapon,
};

export const CarpetMaps: CarpetMap[] = [
    {
        rugBorderSource: "url(/images/Item_Shop/Items/Rings/rug.png)",
        itemDetails: [redRing, greenRing]
    },
    {
        rugBorderSource: "url(/images/Item_Shop/Items/Rings/redrug.png)",
        itemDetails: [weapon_spear, weapon_longsword, weapon_shortsword, weapon_snake_staff]
    },
];
