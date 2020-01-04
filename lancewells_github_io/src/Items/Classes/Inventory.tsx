import { ObservableList } from "./ObservableList";
import { ItemArmor } from "./ItemArmor";
import { ItemPotion } from "./ItemPotion";
import { ItemWeapon } from "./ItemWeapon";
import { ItemWondrous } from "./ItemWondrous";
import { TItemType } from "../Types/TItemType";
import { ItemSource } from "./ItemSource";
import { IItem } from "../Interfaces/IItem";

export class Inventory {
    private _armor: ObservableList<ItemArmor>;
    public get Armor(): ObservableList<ItemArmor> {
        return this._armor;
    }

    private _potions: ObservableList<ItemPotion>;
    public get Potions(): ObservableList<ItemPotion> {
        return this._potions;
    }

    private _weapons: ObservableList<ItemWeapon>;
    public get Weapons(): ObservableList<ItemWeapon> {
        return this._weapons;
    }

    private _wondrous: ObservableList<ItemWondrous>;
    public get Wondrous(): ObservableList<ItemWondrous> {
        return this._wondrous;
    }

    private AddToList<T extends IItem>(listToAddTo: ObservableList<T>, item: T | undefined) {
        if (item != undefined) {
            listToAddTo.AddItem(item);
        }
    }

    private RemoveFromList<T extends IItem>(listToAddTo: ObservableList<T>, item: T | undefined) {
        if (item != undefined) {
            listToAddTo.RemoveItem(item);
        }
    }

    constructor() {
        this._armor = new ObservableList<ItemArmor>();
        this._potions = new ObservableList<ItemPotion>();
        this._weapons = new ObservableList<ItemWeapon>();
        this._wondrous = new ObservableList<ItemWondrous>();
    }

    public AddItem(key: string, type: TItemType) {
        switch (type) {
            case "Armor":
                this.AddToList(this._armor, ItemSource.GetArmor(key));
                break;
            case "Weapon":
                this.AddToList(this._weapons, ItemSource.GetWeapon(key));
                break;
            case "Potion":
                this.AddToList(this._potions, ItemSource.GetPotion(key));
                break;
            case "Wondrous":
                this.AddToList(this._wondrous, ItemSource.GetWondrous(key));
                break;
            default:
                break;
        }
    }

    public RemoveItem(key: string, type: TItemType) {
        switch (type) {
            case "Armor":
                this.RemoveFromList(this._armor, ItemSource.GetArmor(key));
                break;
            case "Weapon":
                this.RemoveFromList(this._weapons, ItemSource.GetWeapon(key));
                break;
            case "Potion":
                this.RemoveFromList(this._potions, ItemSource.GetPotion(key));
                break;
            case "Wondrous":
                this.RemoveFromList(this._wondrous, ItemSource.GetWondrous(key));
                break;
            default:
                break;
        }
    }
}
