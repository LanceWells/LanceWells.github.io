import { ItemSource } from "../../Classes/ItemSource";
import { IItem } from "../../Interfaces/IItem";
import { TItemType } from "../../Types/TItemType";

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
    items: IItem[] = [];

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
        itemType: TItemType,
        items: string[])
    {
        this.rugName = rugName;
        this.rugBorderSource = borderSource;

        items.forEach(item => {
            var itemLookup: IItem | undefined = ItemSource.GetItem(item, itemType);
            if (itemLookup !== undefined) {
                this.items.push(itemLookup);
            }
        })
    }
}

/**
 * @description A constant used to keep track of a set of 'default' rugs. This is primarily for demonstration
 * purposes, and will be removed eventually.
 */
export const CarpetMaps: CarpetMap[] = [
    new CarpetMap("Simple Weapons", "url(/images/Item_Shop/Items/Rugs/purplerug.png)", "Weapon", ["Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "LightHammer", "SnakeStaff", "Quarterstaff", "Spear", "Shortsword", "Shortbow", "BrutalLongsword"]),
    new CarpetMap("Potions", "url(/images/Item_Shop/Items/Rugs/greenrug.png)", "Potion", ["SmallHealth", "SmallMana", "DarkContract", "TiamatBrew", "Angelic", "MiasmaBurning"]),
    new CarpetMap("Wondrous Items", "url(/images/Item_Shop/Items/Rugs/bluerug.png)", "Wondrous", ["RedRing", "BlueRing", "FloralRing"]),
]
