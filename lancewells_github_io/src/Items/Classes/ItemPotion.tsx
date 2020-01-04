import { IItem } from '../Interfaces/IItemDetails';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export class ItemPotion implements IItem {
    public title: string = "";
    public body: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public readonly type: TItemType = "Armor";

    public constructor() { }
}
