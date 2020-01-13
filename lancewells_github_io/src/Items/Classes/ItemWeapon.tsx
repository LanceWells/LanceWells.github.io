import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";
import { TAttack } from "../Types/TAttack";
import { TWeaponProperties } from "../Types/TWeaponProperties";

export class ItemWeapon implements IItem {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public requiresAttunement: boolean = false;
    public shortRange: number = 20;
    public longRange: number = 60;
    public itemCost: number = 0;
    public properties: TWeaponProperties[] = [];
    
    /**
     * @description The mapping here is 1 attack to a series of dice rolls that represent that attack.
     * The idea is that multiple damage types necessitate different rolls or modifiers. Each attack is
     * indexed by a unique name.
     */
    public attacks: { [index: string]: TAttack[] } = {};

    public readonly type: TItemType = "Weapon";
}

export function IItemIsItemWeapon(item: IItem): item is ItemWeapon {
    var isType: boolean = true;

    isType = isType && (item as ItemWeapon).type === "Weapon";
    isType = isType && (item as ItemWeapon).attacks != undefined;

    return isType;
}
