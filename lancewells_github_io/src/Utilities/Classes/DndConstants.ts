import { IItemKey } from "../../ItemData/Interfaces/IItemKey";

export class DnDConstants {
    public static readonly TotalAttunementSlots: number = 3;

    public static GetAttunedItems(items: IItemKey[]): IItemKey[] {
        return items.filter(i => i.adjustments.isAttuned);
    }

    public static GetRemainingAttunementSlots(items: IItemKey[]): number {
        let maxAttune: number = this.TotalAttunementSlots;

        let attunedItems: IItemKey[] = DnDConstants.GetAttunedItems(items);
        let attunedCount: number = attunedItems.length;
        let remainingAttuned: number = maxAttune - attunedCount;

        return (Math.max(remainingAttuned, 0));
    }
}
