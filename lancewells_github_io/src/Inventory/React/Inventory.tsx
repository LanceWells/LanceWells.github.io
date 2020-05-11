import '../Inventory.css';

import React from 'react';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { AttackRollModal } from '../../ItemData/React/AttackRollModal';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { Attack } from '../../ItemData/Classes/Attack';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { InventoryTab } from './InventoryTab';
import { Tabs, Tab } from 'react-bootstrap';
import { CharacterInfoContainer } from '../../CharacterInfo/React/CharacterInfoContainer';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';

export interface IInventoryProps {
}

export interface IInventoryState {
    items: IItem[];
    playerCopper: number;
    showItemDetails: boolean;
    focusedItem: IItem;
    showAttackWindow: boolean;
    attackName: string;
    attacks: Attack[];
    activeTab: string;
    loading: boolean;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    public constructor(props: IInventoryProps) {
        super(props);
        this.state = {
            items: [],
            playerCopper: 0,
            showItemDetails: false,
            focusedItem: new ItemWondrous(),
            showAttackWindow: false,
            attackName: "",
            attacks: [],
            activeTab: ItemType.Weapon.toString(),
            loading: true,
        };

        this.UpdateItems();
    }

    private async UpdateItems() {
        let newItems: IItem[] = [];

        CharacterStateManager.GetInstance().GetCharacter().then(char => {
            if (char !== undefined) {
                char.Items.forEach(item => {
                    let foundItem: IItem | undefined = ItemSource.GetItem(item.key, item.type);

                    if (foundItem !== undefined) {
                        newItems.push(foundItem);
                    }
                });

                this.setState({
                    items: newItems,
                    playerCopper: char.Copper,
                    loading: false
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

    private GetInventoryTabs(): JSX.Element[] {
        let itemTabs: JSX.Element[] = Object.values(ItemType).map(itemType => {
            let filteredItems: IItem[] = this.state.items.filter(item => item.type === itemType);

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
                        itemClick={this.ShowItemDetails.bind(this)}
                        attackClick={this.ShowAttackWindow.bind(this)}
                    />
                </Tab>
            )
        });

        return itemTabs;
    }

    public render() {
        return (
            <div className="inventory-container">
                <LoadingPlaceholder
                    showSpinner={this.state.loading}
                    role="Inventory Loading Status">
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
                    <div className='inventory-tabs-container'>
                        <Tabs
                            id="Inventory Tabs"
                            activeKey={this.state.activeTab.toString()}
                            onSelect={this.HandleTabSelection.bind(this)}
                        >
                            {this.GetInventoryTabs()}
                        </Tabs>
                    </div>
                </LoadingPlaceholder>
            </div>
        )
    }
}
