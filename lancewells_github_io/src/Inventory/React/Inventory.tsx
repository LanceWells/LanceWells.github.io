import '../Inventory.css';

import React, { useState, useEffect } from 'react';
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
import { RemoveClick } from '../../ItemData/Types/CardButtonCallbackTypes/RemoveClick';

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
                let foundItem: IItem | undefined = ItemSource.GetItem(item.key, item.type);

                if (foundItem) {
                    newItems.push(foundItem);
                }
            });
        }

        setItems(newItems);
    }, [charData]);

    function HandleHideDetails() {
        setShowItemDetails(false);
    }
    
    function HandleHideAttack() {
        setShowAttackWindow(false);
    }

    function HandleTabSelection(key: string): void {
        setActiveTab(key);
    }

    function HandleItemClick(item: IItem): void {
        setFocusedItem(item);
        setShowItemDetails(true);
    }

    function HandleAttackClick(attackName: string, attackRolls: Attack[]): void {
        setAttackName(attackName);
        setAttacks(attackRolls);
        setShowAttackWindow(true);
    }

    function HandleRemoveClick(item: IItem): void {
        // if (charData) {
        //     charData.Items.findIndex(i => i)
        // }
        setShowItemDetails(false);
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
                        {GetInventoryTabs(items, HandleItemClick, HandleAttackClick, HandleRemoveClick)}
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
function GetInventoryTabs(items: IItem[], handleItemClick: ItemClick, handleAttackClick: AttackClick, handleRemoveClick: RemoveClick): JSX.Element[] {
    let itemTabs: JSX.Element[] = Object.values(ItemType).map(itemType => {
        let filteredItems: IItem[] = items.filter(item => item.type === itemType);

        return (
            <Tab eventKey={itemType.toString()}
                title={
                    <div>
                        <img className="inventory-tab-icon" src={`./images/Inventory/Tab_${itemType}.png`}/>
                        <span>{`${itemType} (${filteredItems.length})`}</span>
                    </div>
                }>
                <InventoryTab
                    items={filteredItems}
                    itemType={itemType}
                    itemClick={handleItemClick}
                    attackClick={handleAttackClick}
                    removeClick={handleRemoveClick}
                />
            </Tab>
        )
    });

    return itemTabs;
}
