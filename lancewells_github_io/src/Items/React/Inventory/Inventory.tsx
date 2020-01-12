import './Inventory.css';
import React from 'react';
import { InventoryStorage } from '../../Classes/InventoryStorage';
import { ItemArmor } from '../../Classes/ItemArmor';
import { ItemPotion } from '../../Classes/ItemPotion';
import { ItemWeapon } from "../../Classes/ItemWeapon";
import { ItemWondrous } from '../../Classes/ItemWondrous';
import { IItem } from '../../Interfaces/IItem';

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
            armorItems: InventoryStorage.getInstance().GetItemsOfType("Armor"),
            potionItems: InventoryStorage.getInstance().GetItemsOfType("Potion"),
            weaponItems: InventoryStorage.getInstance().GetItemsOfType("Weapon"),
            wondrousItems: InventoryStorage.getInstance().GetItemsOfType("Wondrous"),
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

        // https://stackoverflow.com/questions/43313372/how-to-listen-to-localstorage-in-react-js
        this.handleStorageChange = this.handleStorageChange.bind(this);
    }

    componentDidMount() {
        this.updateFromInventory();
        window.addEventListener("storage", this.handleStorageChange);
    }

    public render() {
        return (
            <div>
                <h1>{InventoryStorage.getInstance().CharacterName}</h1>
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
