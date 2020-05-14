import { ItemModifications } from "../Enums/ItemModifications";

export type ItemAdjustments = {
    magicBonus: number;
    modifications: ItemModifications[];
    notes: string;
}
