import '../css/ItemContainerCreator.css';

import React, { useState } from 'react';
import { ItemFilter } from './ItemFilter';
import { StagedItemsDisplay } from './StagedItemsDisplay';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { DnDConstants } from '../../Utilities/Classes/DndConstants';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { HandleStagedItemsUpdated } from '../Types/HandleStagedItemsUpdated';

export interface IItemContainerCreatorProps {
    handleStagedItemsUpdated: HandleStagedItemsUpdated;
}

export function ItemContainerCreator(props: IItemContainerCreatorProps) {
    const [stagedItems, setStagedItems] = useState<IItem[]>([]);
    const [showItemDetails, setShowItemDetails] = useState(false);
    const [focusedItem, setFocusedItem] = useState<IItem>(new ItemWondrous());

    function HandleHideDetails() {
        setShowItemDetails(false);
    }

    function HandleShowDetails(item: IItem) {
        setFocusedItem(item);
        setShowItemDetails(true);
    }

    function HandleStageItem(item: IItem): void {
        let copyOfStagedItems: IItem[] = stagedItems.slice();
        copyOfStagedItems.push(item);

        setStagedItems(copyOfStagedItems);
        props.handleStagedItemsUpdated(copyOfStagedItems);
    }

    function HandleUnstageItem(item: IItem): void {
        // First, freshen up those items! Otherwise, when we use the JSON stringify to compare, we will
        // get a slew of other, nonsense stuff related to things are not in ItemKey.
        let itemAsFreshKey = DnDConstants.GetItemAsFreshItemKey(item);
        let stagedFreshItems = DnDConstants.GetItemsAsFreshKeys(stagedItems);

        // This is a little verbose, but it makes debugging easier!
        let jsonStringToCompare = JSON.stringify(itemAsFreshKey);
        let itemsAsString: string[] = stagedFreshItems.map(i => JSON.stringify(i));

        let itemToRemove = itemsAsString.findIndex(i => i === jsonStringToCompare);

        if (itemToRemove > -1) {
            let copyOfStagedItems: IItem[] = stagedItems.slice();
            copyOfStagedItems.splice(itemToRemove, 1);
            setStagedItems(copyOfStagedItems);
            props.handleStagedItemsUpdated(copyOfStagedItems);
        }
    }

    return (
        <div className="item-container-creator">
            <ItemDetailsModal
                show={showItemDetails}
                hideModal={HandleHideDetails}
                itemDetails={focusedItem}
                removeCallback={undefined}
                handleUpdatedItemNotes={undefined}
            />
            <ItemFilter
                onItemStaged={HandleStageItem}
                onItemClick={HandleShowDetails}
            />
            <StagedItemsDisplay
                stagedItems={stagedItems}
                onItemUnstaged={HandleUnstageItem}
                onItemClick={HandleShowDetails}
            />
        </div>
    );
}
