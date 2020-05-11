import { IItem } from '../../ItemData/Interfaces/IItem';
import { CarpetBorder } from '../Enums/CarpetBorder';

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
     * Creates a new instance of this object.
     * @param borderSource The location of the border image to use for this carpet.
     * @param rugName The name to display above the carpet.
     * @param items The items that will be displayed on this carpet.
     */
    public constructor(borderSource: CarpetBorder, rugName: string, items: IItem[])
    {
        this.rugName = rugName;
        this.rugBorderSource = borderSource;
        this.items = items;
    }
}
