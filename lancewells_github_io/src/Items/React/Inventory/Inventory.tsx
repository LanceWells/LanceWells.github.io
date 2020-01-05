import './Inventory.css';
import React from 'react';
import { InventoryStorage } from '../../Classes/InventoryStorage';
import { ItemArmor } from '../../Classes/ItemArmor';
import { ItemPotion } from '../../Classes/ItemPotion';
import { ItemWeapon } from "../../Classes/ItemWeapon";
import { ItemWondrous } from '../../Classes/ItemWondrous';

interface IInventoryProps {
}

interface IInventoryState {
    armorItems: Array<ItemArmor>;
    potionItems: Array<ItemPotion>;
    weaponItems: Array<ItemWeapon>;
    wondrousItems: Array<ItemWondrous>;
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
            return (
                <span>{item.title}</span>
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
        // alert(this.state.weaponItems.length);
    }

    private updateFromInventory() {
        // alert("updating");
        this.setState({
            armorItems: InventoryStorage.getInstance().Armor.GetItems(),
            potionItems: InventoryStorage.getInstance().Potions.GetItems(),
            weaponItems: InventoryStorage.getInstance().Weapons.GetItems(),
            wondrousItems: InventoryStorage.getInstance().Wondrous.GetItems(),
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
