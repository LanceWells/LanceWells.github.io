import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export class ItemWondrous implements IItem {
    public readonly key: string = "";
    public title: string = "";
    public body: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public readonly type: TItemType = "Wondrous";
}
