import './Inventory.css';
import React from 'react';
import { CharacterState } from '../../Classes/CharacterState';
import { ItemWeapon } from "../../Classes/ItemWeapon";
import { IItem } from '../../Interfaces/IItem';
import { ItemCard } from '../Common/ItemCard';

interface IInventoryProps {
}

interface IInventoryState {
    armorItems: Array<IItem>;
    potionItems: Array<IItem>;
    weaponItems: Array<IItem>;
    wondrousItems: Array<IItem>;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    private getArmor() {
        return this.state.armorItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    cardInteractions={["Use"]}
                />
            );
        });
    }

    private getPotions() {
        return this.state.potionItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    cardInteractions={["Use"]}
                />
            );
        });
    }

    private getWeapons() {
        return this.state.weaponItems.map((item) => {
            var weapon: ItemWeapon = item as ItemWeapon;
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    cardInteractions={["Use"]}
                />
            );
        });
    }

    private getWondrous() {
        return this.state.wondrousItems.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    cardInteractions={["Use"]}
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
            wondrousItems: []
        }

        // // https://stackoverflow.com/questions/43313372/how-to-listen-to-localstorage-in-react-js
        // this.handleStorageChange = this.handleStorageChange.bind(this);

        const handleChange = this.handleStorageChange;
        CharacterState.GetInstance().onInventoryChanged(handleChange.bind(this))
    }

    componentDidMount() {
        this.updateFromInventory();

        // const handleChange = this.handleStorageChange;
        // CharacterState.GetInstance().onInventoryChanged(handleChange.bind(this))
        // window.addEventListener("storage", this.handleStorageChange);
    }

    public render() {
        return (
            <div className="inventory-container">
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
                        {this.getArmor()}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Potions
                    </div>
                    <div className="inventory-cards">
                        {this.getPotions()}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Weapons
                    </div>
                    <div className="inventory-cards">
                        {this.getWeapons()}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Wondrous Items
                    </div>
                    <div className="inventory-cards">
                        {this.getWondrous()}
                    </div>
                </div>
            </div>
        );
    }
}
