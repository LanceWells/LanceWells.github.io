import { IInventoryListener } from "../Interfaces/IInventoryListener";

export class InventoryType {
    private _items: Array<string>;
    private _listeners: Array<IInventoryListener>;

    constructor() {
        this._items = [];
        this._listeners = [];
    }

    public GetItems(): Array<string> {
        return this._items;
    }

    public SetItems(newItems: Array<string>) {
        this._items = newItems;
        this.NotifyListeners();
    }

    public AddItem(newItem: string) {
        this._items.push(newItem)
        this.NotifyListeners();
    }

    public AddListener(listener: IInventoryListener) {
        this._listeners.push(listener);
    }

    private NotifyListeners() {
        this._listeners.forEach(listener => {
            listener(this._items);
        });
    }
}
