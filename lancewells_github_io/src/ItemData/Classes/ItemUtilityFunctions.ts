// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
// https://gist.github.com/robmathers/1830ce09695f759bf2c4df15c29dd22d

import { IItem } from "../Interfaces/IItem";
import { ItemType } from "../Enums/ItemType";

export function GroupItemsByType(items: IItem[]): Map<ItemType, IItem[]> {
    // let organizedItems =  items.reduce(function (storage: Map<ItemType, IItem[]>, item: IItem) {
    //     // get the first instance of the key by which we're grouping
    //     let group = item.type;

    //     // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
    //     storage[group] = storage[group] ?? [];

    //     // add this item to its group within `storage`
    //     storage[group].push(item);

    //     // return the updated storage to the reduce function, which will then loop through the next 
    //     return storage;
    // }, {}); // {} is the initial value of the storage

    // let mappedItems: Map<ItemType, IItem[]> = new Map();

    // Object.values(ItemType).forEach(itemType => {
    //     if (organizedItems[itemType]) {
    //         mappedItems.set(itemType, organizedItems[itemType]);
    //     }
    // });
    let organizedItems: Map<ItemType, IItem[]> = new Map();
    Object.values(ItemType).forEach(itemType => {
        let filteredItems: IItem[] = items.filter(item => item.type === itemType);
        if (filteredItems.length > 0) {
            organizedItems.set(itemType, filteredItems);
        }
    });

    return organizedItems;
};
