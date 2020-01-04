import { ObservableList } from "./ObservableList";
import { ItemArmor } from "./ItemArmor";
import { ItemPotion } from "./ItemPotion";
import { ItemWeapon } from "./ItemWeapon";
import { ItemWondrous } from "./ItemWondrous";

export class Inventory {
    public ArmorAccess: ObservableList<ItemArmor>;
    public PotionsAccess: ObservableList<ItemPotion>;
    public WeaponsAccess: ObservableList<ItemWeapon>;
    public WondrousItemsAccess: ObservableList<ItemWondrous>;

    constructor() {
        this.ArmorAccess = new ObservableList<ItemArmor>();
        this.PotionsAccess = new ObservableList<ItemPotion>();
        this.WeaponsAccess = new ObservableList<ItemWeapon>();
        this.WondrousItemsAccess = new ObservableList<ItemWondrous>();
    }
}
