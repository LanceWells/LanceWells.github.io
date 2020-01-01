import { InventoryType } from "./InventoryType";

export class InventoryAccess {
    public ArmorAccess: InventoryType;
    public PotionsAccess: InventoryType;
    public WeaponsAccess: InventoryType;
    public WondrousItemsAccess: InventoryType;

    constructor() {
        this.ArmorAccess = new InventoryType();
        this.PotionsAccess = new InventoryType();
        this.WeaponsAccess = new InventoryType();
        this.WondrousItemsAccess = new InventoryType();
    }
}
