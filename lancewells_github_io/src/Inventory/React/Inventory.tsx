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
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';
import { LoginState } from '../../LoginPage/Enums/LoginState';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { UserDataAuth } from '../../FirebaseAuth/Classes/UserDataAuth';

enum LoadingState {
    Loading,
    Loaded,
    Anonymous,
    NoCharacters
}

export interface IInventoryProps {
    loginState: LoginState;
}

export interface IInventoryState {
    items: IItem[];
    showItemDetails: boolean;
    focusedItem: IItem;
    showAttackWindow: boolean;
    attackName: string;
    attacks: Attack[];
    activeTab: string;
    loadingState: LoadingState;
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
            activeTab: ItemType.Weapon.toString(),
            loadingState: LoadingState.Loading,
        };

        this.UpdateItems();
        CharacterStateManager.GetInstance().AddObserver(this.characterStateManager_NotifyObservers.bind(this))
    }

    public componentDidUpdate(prevProps: IInventoryProps): void {
        if (this.props.loginState !== prevProps.loginState || this.state.loadingState == LoadingState.NoCharacters) {
            // basically, use this to handle login or logout events. otherwise, just load what we have. the
            // auto-login is messing with using only this.
            this.UpdateItems();
        }
    }

    public characterStateManager_NotifyObservers(charData: PlayerCharacterData | undefined): void {
        this.UpdateItems();
    }

    private async UpdateItems() {
        let newItems: IItem[] = [];
        let loadingState: LoadingState = LoadingState.Anonymous;
        let userHasAccess: boolean = await UserDataAuth.GetInstance().CheckForAccess();

        if (userHasAccess) {
            let staticCharData: PlayerCharacterData | undefined = undefined; 
            staticCharData = await CharacterStateManager.GetInstance().GetCharacter();
            
            if (staticCharData === undefined) {
                loadingState = LoadingState.NoCharacters;
            }
            else {
                staticCharData.Items.forEach(item => {
                    let foundItem: IItem | undefined = ItemSource.GetItem(item.key, item.type);

                    if (foundItem) {
                        newItems.push(foundItem);
                    }
                });

                loadingState = LoadingState.Loaded;
            }
        }

        this.setState({
            items: newItems,
            loadingState: loadingState,
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
                    showSpinner={this.state.loadingState === LoadingState.Loading}
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
