import './Inventory.css';
import React from 'react';
import { CharacterState } from '../../Classes/CharacterState';
import { ItemWeapon } from "../../Classes/ItemWeapon";
import { IItemJson } from '../../Interfaces/IItem';

interface IInventoryProps {
}

interface IInventoryState {
    armorItems: Array<IItemJson>;
    potionItems: Array<IItemJson>;
    weaponItems: Array<IItemJson>;
    wondrousItems: Array<IItemJson>;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    private getArmor() {
        return this.state.armorItems.map((item) => {
            return (
                <span>{item.title}</span>
            );
        });
    }

    private getPotions() {
        return this.state.potionItems.map((item) => {
            return (
                <span>{item.title}</span>
            );
        });
    }

    private getWeapons() {
        return this.state.weaponItems.map((item) => {
            var weapon: ItemWeapon = item as ItemWeapon;
            return (
                <span>{weapon.title + Object.keys(weapon.attacks)[0]}</span>
            );
        });
    }

    private getWondrous() {
        return this.state.wondrousItems.map((item) => {
            return (
                <span>{item.title}</span>
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
            <div>
                <h1>{CharacterState.GetInstance().CurrentCharacter}</h1>
                <h1>Armor</h1>
                {this.getArmor()}
                <h1>Potions</h1>
                {this.getPotions()}
                <h1>Weapons</h1>
                {this.getWeapons()}
                <h1>Wondrous Items</h1>
                {this.getWondrous()}
            </div>
        );
    }
}
