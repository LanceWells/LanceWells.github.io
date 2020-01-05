import { IListListener } from "../Interfaces/IListListener";

export class ObservableList<T> {
    private _items: Array<T>;
    private _listeners: Array<IListListener<T>>;

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

    public RemoveItem(itemToRemove: T) {

        for (let i = 0; i < this._items.length; i++)
        {
            if (this._items[i] === itemToRemove)
            {
                // By removing an item, we're reducing the size of this array, and by effect jumping
                // forward one index if we don't backtrack.
                this._items.splice(i--, 1);
            }
        }
        this.NotifyListeners();
    }

    public AddListener(listener: IListListener<T>) {
        this._listeners.push(listener);
    }

    private NotifyListeners() {
        var itemsCopy: Array<T> = [];
        itemsCopy = this._items.slice(0);

        this._listeners.forEach(listener => {
            listener(itemsCopy);
        });
    }
}
