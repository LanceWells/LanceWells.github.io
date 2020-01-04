import { ListListener } from "../Interfaces/IInventoryListener";

export class ObservableList<T> {
    private _items: Array<T>;
    private _listeners: Array<ListListener<T>>;

    constructor() {
        this._items = [];
        this._listeners = [];
    }

    public GetItems(): Array<T> {
        return this._items;
    }

    public SetItems(newItems: Array<T>) {
        this._items = newItems;
        this.NotifyListeners();
    }

    public AddItem(newItem: T) {
        this._items.push(newItem)
        this.NotifyListeners();
    }

    public AddListener(listener: ListListener<T>) {
        this._listeners.push(listener);
    }

    private NotifyListeners() {
        this._listeners.forEach(listener => {
            listener(this._items);
        });
    }
}
