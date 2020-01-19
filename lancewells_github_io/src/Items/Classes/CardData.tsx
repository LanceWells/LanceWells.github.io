import { TItemType } from '../Types/TItemType';
import { TCardModifications } from '../Types/TCardModifications';

export class CardData {
    public itemType: TItemType = "Wondrous";
    public itemKey: string = "";
    public modifications: TCardModifications[] = [];
}
