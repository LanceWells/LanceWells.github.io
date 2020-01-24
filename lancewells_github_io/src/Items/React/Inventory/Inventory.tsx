import './Inventory.css';
import React from 'react';
import { CharacterState } from '../../Classes/CharacterState';
import { ItemWeapon } from "../../Classes/ItemWeapon";
import { IItem } from '../../Interfaces/IItem';
import { ItemCard, TItemClick } from '../Common/ItemCard';
import { TRemoveClick } from '../../Types/CardButtonCallbackTypes/TRemoveClick';
import { AttackRollModal } from '../Common/AttackRollModal';
import { TAttackClick } from '../../Types/CardButtonCallbackTypes/TAttackClick';
import { TAttack } from '../../Types/TAttack';
import { ItemWondrous } from '../../Classes/ItemWondrous';
import { ItemDetailsModal } from '../Common/ItemDetailsModal';

interface IInventoryProps {
}

interface IInventoryState {
    armorItems: Array<IItem>;
    potionItems: Array<IItem>;
    weaponItems: Array<IItem>;
    wondrousItems: Array<IItem>;

    showAttackRoll: boolean;
    attackName: string;
    attackRolls: TAttack[];

    showItemDialog: boolean;
    itemDetails: IItem;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    private getArmor(itemClick: TItemClick, removeCallback: TRemoveClick) {
        return this.state.armorItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private getPotions(itemClick: TItemClick, removeCallback: TRemoveClick) {
        return this.state.potionItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private getWeapons(itemClick: TItemClick, removeCallback: TRemoveClick, attackCallback: TAttackClick) {
        return this.state.weaponItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={attackCallback}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private getWondrous(itemClick: TItemClick, removeCallback: TRemoveClick) {
        return this.state.wondrousItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private handleStorageChange() {
        this.updateFromInventory();
    }

    private updateFromInventory() {
        this.setState({
            armorItems: CharacterState.GetInstance().GetCurrentItemsOfType("Armor"),
            potionItems: CharacterState.GetInstance().GetCurrentItemsOfType("Potion"),
            weaponItems: CharacterState.GetInstance().GetCurrentItemsOfType("Weapon"),
            wondrousItems: CharacterState.GetInstance().GetCurrentItemsOfType("Wondrous"),
        });
    }

    public constructor(props: IInventoryProps) {
        super(props);
        this.state = {
            armorItems: [],
            potionItems: [],
            weaponItems: [],
            wondrousItems: [],
            showAttackRoll: false,
            attackName: "",
            attackRolls: [],
            showItemDialog: false,
            itemDetails: new ItemWondrous(),
        }

        const handleChange = this.handleStorageChange;
        CharacterState.GetInstance().onInventoryChanged(handleChange.bind(this))
    }

    componentDidMount() {
        this.updateFromInventory();
    }

    public render() {
        const removeButton = (item: IItem) => {
            CharacterState.GetInstance().RemoveItemFromCurrentCharacter(item);
        }

        const handleItemClick: TItemClick = (item: IItem) => {
            this.setState({
                itemDetails: item,
                showItemDialog: true
            });
        };

        const hideDetailsModal = () => {
            this.setState({
                showItemDialog: false,
            });
        };

        const showAttackModal: TAttackClick = (attackName: string, attackRolls: TAttack[]) => {
            this.setState({
                showAttackRoll: true,
                attackName: attackName,
                attackRolls: attackRolls
            });
        };

        const hideAttackModal = () => {
            this.setState({
                showAttackRoll: false
            })
        };

        return (
            <div className="inventory-container">
                <AttackRollModal
                    show={this.state.showAttackRoll}
                    onHide={hideAttackModal}
                    attackName={this.state.attackName}
                    attacks={this.state.attackRolls} />
                <ItemDetailsModal
                    show={this.state.showItemDialog}
                    hideModal={hideDetailsModal}
                    itemDetails={this.state.itemDetails} />
                <div className="inventory-title-container">
                    <h2 className="inventory-title-underlined">
                        {CharacterState.GetInstance().CurrentCharacter}
                    </h2>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Armor
                    </div>
                    <div className="inventory-cards">
                        {this.getArmor(handleItemClick, removeButton)}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Potions
                    </div>
                    <div className="inventory-cards">
                        {this.getPotions(handleItemClick, removeButton)}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Weapons
                    </div>
                    <div className="inventory-cards">
                        {this.getWeapons(handleItemClick, removeButton, showAttackModal)}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Wondrous Items
                    </div>
                    <div className="inventory-cards">
                        {this.getWondrous(handleItemClick, removeButton)}
                    </div>
                </div>
            </div>
        );
    }
}
