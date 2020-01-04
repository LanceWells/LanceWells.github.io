import { ItemSource } from "../Common/ItemSource";
import { IItem } from "../../Interfaces/IItem";
import { ItemWeapon } from "../../Classes/ItemWeapon";
import { ItemArmor } from "../../Classes/ItemArmor";
import { ItemPotion } from "../../Classes/ItemPotion";
import { ItemWondrous } from "../../Classes/ItemWondrous";

/**
 * @description A class used to represent a 'carpet'. A carpet is a section of an item shop, where
 * similar items are grouped together.
 */
export class CarpetMap {
    /**
     * @description The name to display above the rug.
     */
    rugName: string = "";

    /**
     * @description The items that are contained within the rug.
     */
    items: Array<IItem> = [];

    /**
     * @description The border source image to display around the rug. The syntax for this should be:
     * "url(/images/Item_Shop/Items/Rugs/purplerug.png)"
     * 
     * where the root folder is the public folder.
     */
    rugBorderSource: string = "";

    /**
     * @description The constructor for this object.
     * @param rugName The name to display above the rug.
     * @param borderSource The url source for the border image to display around the rug.
     * @param weapons A list of weapon item keys to include within this rug.
     * @param armor A list of armor item keys to include within this rug.
     * @param potions A list of potion item keys to include within this rug.
     * @param wondrous A list of wondrous item keys to include within this rug.
     */
    public constructor(
        rugName: string,
        borderSource: string,
        weapons: Array<string>,
        armor: Array<string>,
        potions: Array<string>,
        wondrous: Array<string>)
    {
        this.rugName = rugName;
        this.rugBorderSource = borderSource;

        var getWeapons = (itemIndex: string) => { return ItemSource.GetWeapon(itemIndex) }
        var getArmor = (itemIndex: string) => { return ItemSource.GetArmor(itemIndex) }
        var getPotions = (itemIndex: string) => { return ItemSource.GetPotion(itemIndex) }
        var getWondrous = (itemIndex: string) => { return ItemSource.GetWondrous(itemIndex) }

        this.AddItems<ItemWeapon>(weapons, getWeapons);
        this.AddItems<ItemArmor>(armor, getArmor);
        this.AddItems<ItemPotion>(potions, getPotions);
        this.AddItems<ItemWondrous>(wondrous, getWondrous);
    }

    /**
     * @description Gets a list of items of the specified type, from the specified function call.
     * @param itemIndices The list of item indices to iterate over. This should result in a 1:1 list of items.
     * @param itemFunc The function used to get the items.
     */
    private AddItems<T extends IItem>(itemIndices: Array<string>, itemFunc: (itemIndex: string) => T | undefined): void {
        var items: Array<T> = [];

        itemIndices.forEach(itemIndex => {
            var item = itemFunc(itemIndex);
            if (item !== undefined)
            {
                items.push(item as T);
            }
            else
            {
                console.error(`The item ${itemIndex} could not be found.`);
            }
        });

        items.forEach(item => {
            this.items.push(item);
        });
    }
}

/**
 * @description A constant used to keep track of a set of 'default' rugs. This is primarily for demonstration
 * purposes, and will be removed eventually.
 */
export const CarpetMaps: CarpetMap[] = [
    new CarpetMap("Simple Weapons", "url(/images/Item_Shop/Items/Rugs/purplerug.png)", ["Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "LightHammer"], [], [], []),
    new CarpetMap("Potions", "url(/images/Item_Shop/Items/Rugs/greenrug.png)", [], [], ["SmallHealth", "SmallMana", "DarkContract", "TiamatBrew", "Angelic", "MiasmaBurning"], []),
    new CarpetMap("Wondrous Items", "url(/images/Item_Shop/Items/Rugs/bluerug.png)", [], [], [], ["RedRing", "BlueRing", "FloralRing"]),
]
