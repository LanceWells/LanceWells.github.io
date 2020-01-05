import { IItem } from '../Interfaces/IItem';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";
import { TAttack } from "../Types/TAttack";

export class ItemWeapon implements IItem {
    public readonly key: string = "";
    public title: string = "";
    public body: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    
    /**
     * @description The mapping here is 1 attack to a series of dice rolls that represent that attack.
     * The idea is that multiple damage types necessitate different rolls or modifiers. Each attack is
     * indexed by a unique name.
     */
    public attacks: { [index: string]: TAttack[] } = {};

    public readonly type: TItemType = "Weapon";
}
