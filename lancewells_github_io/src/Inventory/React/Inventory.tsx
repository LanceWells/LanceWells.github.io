import '../Inventory.css';

import React from 'react';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { AttackRollModal } from '../../ItemData/React/AttackRollModal';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { Attack } from '../../ItemData/Classes/Attack';
import { CardInteractions } from '../../ItemData/Enums/CardInteractions';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { InventoryTab } from './InventoryTab';
import { Tabs, Tab } from 'react-bootstrap';

export interface IInventoryProps {
}

export interface IInventoryState {
    items: IItem[];
    showItemDetails: boolean;
    focusedItem: IItem;
    showAttackWindow: boolean;
    attackName: string;
    attacks: Attack[];
    activeTab: string;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    public constructor(props: IInventoryProps) {
        super(props);
        this.state = {
            items: [],
            showItemDetails: false,
            focusedItem: new ItemWondrous(),
            showAttackWindow: false,
            attackName: "",
            attacks: [],
            activeTab: ItemType.Weapon.toString()
        };

        this.UpdateItems();
    }

    private async UpdateItems() {
        let newItems: IItem[] = [];

        CharacterStateManager.GetInstance().GetCurrentStaticCharacterData().then(char => {
            if (char !== undefined) {
                char.Items.forEach(item => {
                    let foundItem: IItem | undefined = ItemSource.GetItem(item.key, item.type);

                    if (foundItem !== undefined) {
                        newItems.push(foundItem);
                    }
                });

                this.setState({
                    items: newItems
                });
            }
        });
    }

    private ShowItemDetails(itemJson: IItem): void {
        this.setState({
            showItemDetails: true,
            focusedItem: itemJson
        })
    }

    private HideItemDetails() {
        this.setState({
            showItemDetails: false
        })
    }

    private ShowAttackWindow(attackName: string, attackRolls: Attack[]): void {
        this.setState({
            showAttackWindow: true,
            attackName: attackName,
            attacks: attackRolls
        });
    }

    private HideAttackWindow(): void {
        this.setState({
            showAttackWindow: false
        });
    }

    private HandleTabSelection(key: string): void {
        this.setState({
            activeTab: key
        })
    }

    public render() {
        // let itemCards: JSX.Element[] = this.state.items.map(i => {
        //     return (
        //         <ItemCard
        //             itemDetails={i}
        //             onItemClick={this.ShowItemDetails.bind(this)}
        //             onAttackButton={this.ShowAttackWindow.bind(this)}
        //             onPurchaseButton={undefined}
        //             onRemoveButton={undefined}
        //             onAddButton={undefined}
        //             cardInteractions={[
        //                 CardInteractions.Use
        //             ]}
        //         />
        //     )
        // });

        let itemTabs: JSX.Element[] = Object.values(ItemType).map(itemType => {
            let filteredItemTypes: IItem[] = this.state.items.filter(item => item.type === itemType);

            return (
                <Tab eventKey={itemType.toString()} title={itemType.toString()}>
                    <InventoryTab
                        items={filteredItemTypes}
                        itemType={itemType}
                        itemClick={this.ShowItemDetails.bind(this)}
                        attackClick={this.ShowAttackWindow.bind(this)}
                    />
                </Tab>
            )
        });

        return (
            <div className="inventory-container">
                <ItemDetailsModal
                    show={this.state.showItemDetails}
                    hideModal={this.HideItemDetails.bind(this)}
                    itemDetails={this.state.focusedItem}
                />
                <AttackRollModal
                    show={this.state.showAttackWindow}
                    attackName={this.state.attackName}
                    attacks={this.state.attacks}
                    onHide={this.HideAttackWindow.bind(this)}
                />
                <Tabs
                    id="Inventory Tabs"
                    activeKey = { this.state.activeTab.toString() }
                    onSelect={this.HandleTabSelection.bind(this)}
                    >
                    {itemTabs}
                </Tabs>
            </div>
        )
    }
}

// { itemTypes }
// activeKey = { this.state.activeTab.toString() }
// <Tab eventKey={ItemType.Weapon.toString()} title={ItemType.Weapon.toString()}>
//     Test!
//                     </Tab>