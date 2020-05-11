import { IItem } from "../Interfaces/IItem";
import { ItemType } from "../Enums/ItemType";

export function GroupItemsByType(items: IItem[]): Map<ItemType, IItem[]> {
    let organizedItems: Map<ItemType, IItem[]> = new Map();
    Object.values(ItemType).forEach(itemType => {
        let filteredItems: IItem[] = items.filter(item => item.type === itemType);
        if (filteredItems.length > 0) {
            organizedItems.set(itemType, filteredItems);
        }
    });

    return organizedItems;
};
