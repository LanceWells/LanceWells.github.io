import '../Inventory.css';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { AttackRollModal } from '../../ItemData/React/AttackRollModal';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { Attack } from '../../ItemData/Classes/Attack';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { InventoryTab } from './InventoryTab';
import { Tabs, Tab } from 'react-bootstrap';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { LoginState } from '../../LoginPage/Enums/LoginState';
import { LoadingState } from '../../Utilities/Enums/LoadingState';
import { useLoadingState } from '../../Utilities/Hooks/useLoadingState';
import { useCharData } from '../../Utilities/Hooks/useCharData';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';
import { AttackClick } from '../../ItemData/Types/CardButtonCallbackTypes/AttackClick';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { AttuneClick } from '../../ItemData/Types/CardButtonCallbackTypes/AttuneClick';
import { UnattuneClick } from '../../ItemData/Types/CardButtonCallbackTypes/UnattuneClick';
import { DnDConstants } from '../../Utilities/Classes/DndConstants';

export interface IInventoryProps {
    loginState: LoginState;
}

export function Inventory(props: IInventoryProps) {
    /**
     * A series of items that will be rendered by this class. This should come entirely from the loaded
     * character data.
     */
    const [items, setItems] = useState<IItem[]>([]);

    /**
     * A boolean value informing the item details window when to be visible.
     */
    const [showItemDetails, setShowItemDetails] = useState(false);

    /**
     * A boolean value indicating what to use as the item to display in the item details window.
     */
    const [focusedItem, setFocusedItem] = useState<IItem>(new ItemWondrous());

    /**
     * A boolean value informing the attack window when to be visible.
     */
    const [showAttackWindow, setShowAttackWindow] = useState(false);

    /**
     * The attack name that will be displayed in the attack window.
     */
    const [attackName, setAttackName] = useState("");

    /**
     * A series of attacks to get damage values for whem the attack window is open. Note that these are not
     * separate actions, but separate damage values.
     */
    const [attacks, setAttacks] = useState<Attack[]>([]);

    /**
     * The active tab name. Required for the bootstrap component.
     */
    const [activeTab, setActiveTab] = useState(ItemType.Weapon.toString());

    /**
     * The item notes that are currently being edited for an item. Will be saved once a user closes a modal.
     */
    const [updatedItemNotes, setUpdatedItemNotes] = useState<string | undefined>(undefined);

    const loadingState = useLoadingState(props.loginState);
    const charData = useCharData(loadingState);

    /**
     * Gets the user's items from a common source. Only adds items that have a discrete value. Only runs when
     * the user's character data updates.
     */
    useEffect(() => {
        let newItems: IItem[] = [];

        if (charData) {
            charData.Items.forEach(item => {
                let foundItem: IItem | undefined = ItemSource.GetItem(item);

                if (foundItem) {
                    newItems.push(foundItem);
                }
            });
        }

        setItems(newItems);
    }, [charData]);

    function HandleHideDetails() {
        setShowItemDetails(false);
        if (charData && updatedItemNotes && focusedItem.adjustments.notes !== updatedItemNotes) {
            // focusedItem is a reference, so we can just update it here and re-submit this char data to be
            // updated on the server.
            focusedItem.adjustments.notes = updatedItemNotes;
            CharacterStateManager.GetInstance().UploadCharacterData(charData);
        }

        // Ensure that these go back to being 'undefined'. We don't want to set the item notes for everything
        // that the user opens.
        setUpdatedItemNotes(undefined);
    }
    
    function HandleHideAttack() {
        setShowAttackWindow(false);
    }

    function HandleTabSelection(key: string): void {
        setActiveTab(key);
    }

    function HandleShowDetails(item: IItem): void {
        setFocusedItem(item);
        setShowItemDetails(true);
    }

    function HandleAttackClick(attackName: string, attackRolls: Attack[]): void {
        setAttackName(attackName);
        setAttacks(attackRolls);
        setShowAttackWindow(true);
    }

    function HandleAttuneClick(item: IItem): void {
        let itemAlreadyAttuned = item.adjustments.isAttuned;

        if (charData && !itemAlreadyAttuned) {
            // Good newts! This is a reference to the item from the character inventory, so just add this
            // modification and update the remote!
            item.adjustments.isAttuned = true;
            CharacterStateManager.GetInstance().UploadCharacterData(charData);
        }
    }

    function HandleUnattuneClick(item: IItem): void {
        let itemIsAttuned = item.adjustments.isAttuned;

        if (charData && itemIsAttuned) {
            // Good newts! This is a reference to the item from the character inventory, so just remove this
            // modification and update the remote!
            item.adjustments.isAttuned = false;
            CharacterStateManager.GetInstance().UploadCharacterData(charData);
        }
    }

    function HandleUpdateItemNotes(event: ChangeEvent<HTMLTextAreaElement>) {
        if (event && event.target && event.target.value) {
            setUpdatedItemNotes(event.target.value);
        }
    }

    function HandleRemoveClick(item: IItem): void {
        setShowItemDetails(false);

        if (charData) {
            // First, freshen up those items! Otherwise, when we use the JSON stringify to compare, we will
            // get a slew of other, nonsense stuff related to things are not in ItemKey.
            let itemAsFreshKey = DnDConstants.GetItemAsFreshItemKey(item);
            let charDataFreshItems = DnDConstants.GetItemsAsFreshKeys(charData.Items);

            // This is a little verbose, but it makes debugging easier!
            let jsonStringToCompare = JSON.stringify(itemAsFreshKey);
            let itemsAsString: string[] = charDataFreshItems.map(i => JSON.stringify(i));

            let itemToRemove = itemsAsString.findIndex(i => i === jsonStringToCompare);

            if (itemToRemove > -1) {
                charData.Items.splice(itemToRemove, 1);
                CharacterStateManager.GetInstance().UploadCharacterData(charData);
            }
        }
    }

    return (
        <div className="inventory-container">
            <LoadingPlaceholder
                showSpinner={loadingState === LoadingState.Loading}
                role="Inventory Loading Status">
                <ItemDetailsModal
                    show={showItemDetails}
                    hideModal={HandleHideDetails}
                    itemDetails={focusedItem}
                    removeCallback={HandleRemoveClick}
                    handleUpdatedItemNotes={HandleUpdateItemNotes}
                />
                <AttackRollModal
                    show={showAttackWindow}
                    attackName={attackName}
                    attacks={attacks}
                    onHide={HandleHideAttack}
                />
                <div className='inventory-tabs-container'>
                    <Tabs
                        id="Inventory Tabs"
                        activeKey={activeTab.toString()}
                        onSelect={HandleTabSelection}
                    >
                        {GetInventoryTabs(items, HandleShowDetails, HandleAttackClick, HandleAttuneClick, HandleUnattuneClick)}
                    </Tabs>
                </div>
            </LoadingPlaceholder>
        </div>
    );
}

/**
 * Gets a tabbed component for each item type that will exist in the inventory.
 * @param items The entire series of items for the current character.
 * @param handleItemClick Handles when a user clicks for an item display.
 * @param handleAttackClick Handles when a user clicks an attack button for an item.
 */
function GetInventoryTabs(items: IItem[], handleItemClick: ItemClick, handleAttackClick: AttackClick, handleAttuneClick: AttuneClick, handleUnattuneClick: UnattuneClick): JSX.Element[] {
    let itemTabs: JSX.Element[] = Object.values(ItemType).map(itemType => {
        let filteredItems: IItem[] = items.filter(item => item.type === itemType);
        let remainingAttunements: number = DnDConstants.GetRemainingAttunementSlots(items);

        // https://stackoverflow.com/questions/8900732/sort-objects-in-an-array-alphabetically-on-one-property-of-the-array
        let sortedItems: IItem[] = filteredItems.sort((a, b) => {
            let upperA = a.title;
            let upperB = b.title;
            let retVal = 0;

            if (upperA > upperB) {
                retVal = 1;
            }
            else {
                retVal = -1;
            }

            return retVal;
        });

        return (
            <Tab eventKey={itemType.toString()}
                title={
                    <div>
                        <img
                            alt="inventory tab icon"
                            className="inventory-tab-icon"
                            src={`./images/Inventory/Tab_${itemType}.png`}/>
                        <span>{`${itemType} (${sortedItems.length})`}</span>
                    </div>
                }>
                <InventoryTab
                    items={sortedItems}
                    itemType={itemType}
                    itemClick={handleItemClick}
                    attackClick={handleAttackClick}
                    attuneClick={handleAttuneClick}
                    unattuneClick={handleUnattuneClick}
                    availableAttunementSlots={remainingAttunements}
                />
            </Tab>
        )
    });

    return itemTabs;
}
