import { ObservableList } from "./ObservableList";
import { ItemArmor } from "./ItemArmor";
import { ItemPotion } from "./ItemPotion";
import { ItemWeapon } from "./ItemWeapon";
import { ItemWondrous } from "./ItemWondrous";
import { TItemType } from "../Types/TItemType";
import { ItemSource } from "./ItemSource";
import { IItem } from "../Interfaces/IItem";
import { TInventoryModel } from "../Types/TInventoryModel";
import { TInventoryModelStorage } from "../Types/TInventoryModelStorage";
import { EStorageType } from "../Enums/EStorageType";

/**
 * @description This class serves as a listen-able instance of a character's inventory. This is served as
 * a singleton; there should only ever be one inventory at a time. Multiple inventories may be saved in a
 * user's storage (in future, via AWS NoSQL), but only one inventory is available at a time.
 * 
 * @reference https://medium.com/javascript-everyday/singleton-made-easy-with-typescript-6ad55a7ba7ff
 */
export class InventoryStorage {
    private static instance: InventoryStorage;

    private _armor: ObservableList<ItemArmor> = new ObservableList<ItemArmor>();
    private _potions: ObservableList<ItemPotion> = new ObservableList<ItemPotion>();
    // private _weapons: ObservableList<IItem> = new ObservableList<IItem>();
    // Use strings as the key for this map; objects as keys require direct references to the same object.
    // https://stackoverflow.com/questions/43592760/typescript-javascript-using-tuple-as-key-of-map
    private _items: Map<TItemType, IItem[]> = new Map<TItemType, IItem[]>();
    private _wondrous: ObservableList<ItemWondrous> = new ObservableList<ItemWondrous>();
    private _characterName: string;

    // https://regex101.com/r/AJU90m/1
    private readonly _validCharnameCharacters: RegExp = /^[a-z0-9 ]+$/i;

    /**
     * @description Stores the current character's name. Calling the setter for this name will force the
     * inventory to update each observable list.
     */
    public get CharacterName(): string {
        return this._characterName;
    }

    /**
     * @description Stores the current character's name. Calling the setter for this name will force the
     * inventory to update each observable list.
     */
    public set CharacterName(name: string) {
        this._characterName = name;

        // Save the last set character name in local storage. This lets someone reload their browser without
        // having to re-select the same character.
        localStorage.setItem(EStorageType.CharacterName, name);
        this.UpdateInventoryUsingCache();
    }

    public GetItemsOfType(type: TItemType): IItem[] {
        var typedItems: IItem[] = [];

        if (this._items.has(type))
        {
            typedItems = this._items.get(type) as IItem[];
        }

        return typedItems;
    }

    /**
     * @description Stores the current character's armor items.
     */
    public get Armor(): ObservableList<ItemArmor> {
        return this._armor;
    }

    /**
     * @description Stores the current character's potion items.
     */
    public get Potions(): ObservableList<ItemPotion> {
        return this._potions;
    }

    // /**
    //  * @description Stores the current character's weapon items.
    //  */
    // public get Weapons(): ObservableList<IItem> {
    //     return this._weapons;
    // }

    /**
     * @description Stores the current character's wondrous items.
     */
    public get Wondrous(): ObservableList<ItemWondrous> {
        return this._wondrous;
    }

    /**
     * The constructor for this class.
     */
    private constructor() {
        // This is going to be an event listener, so ensure that a calling context knows what 'this' is.
        this.UpdateInventoryUsingCache = this.UpdateInventoryUsingCache.bind(this);

        window.addEventListener("storage", this.UpdateInventoryUsingCache);

        this._characterName = "";

        this.InitializeLists();

        /*
         * First, check and see if the local storage is holding the key:
         *  CharacterName
         * 
         * If localstorage has that key, then get it. Otherwise, we need to 
         * 
         * Get the character's name from the key:
         *  CharacterName
         * 
         * Then call the setter function for CharacterName. This will invoke updating the inventory.
         */

        var parsedStorage: TInventoryModelStorage = this.GetInventoryStorage();
        var atLeastOneValidNameExists: Boolean = Object.keys(parsedStorage).length > 0;

        if (!atLeastOneValidNameExists) {
            this.AddCharacter();
        }
        else {
            var charName: string;
            var storedName: string | null = localStorage.getItem(EStorageType.CharacterName);

            if (storedName != null) {
                charName = storedName as string;
            }
            else {
                charName = Object.keys(parsedStorage)[0];
            }

            this.CharacterName = charName;
        }
    }

    /**
     * @description Provides the single instance of this class.
     */
    public static getInstance() {
        if (!InventoryStorage.instance) {
            InventoryStorage.instance = new InventoryStorage();
        }

        return InventoryStorage.instance;
    }

    /**
     * @description Adds a character to the list of characters in the inventory. New characters will start
     * with an empty inventory.
     */
    public AddCharacter() {
        var nameIsValid: boolean = false;
        var charName: string = "";
        var userHitCancel: Boolean = false;
        var userUsedInvalidCharacters: Boolean = false;
        var userEnteredExistingName: Boolean = false;

        var parsedStorage: TInventoryModelStorage = this.GetInventoryStorage();
        var atLeastOneValidNameExists: Boolean = Object.keys(parsedStorage).length > 0;

        // Keep asking the user to display a name until they have some valid input, or until they hit cancel.
        // Note that a user can only continue by hitting cancel if they have at least one valid name.
        while (!nameIsValid && !(userHitCancel && atLeastOneValidNameExists)) {
            let userPrompt: string = "Please enter a character name.";

            if (userHitCancel && !atLeastOneValidNameExists) {
                userPrompt = userPrompt + " Use of the inventory system requires at least one character.";
            }
            if (userUsedInvalidCharacters) {
                userPrompt = userPrompt + " Valid characters are alphanumerics and spaces.";
            }
            if (userEnteredExistingName) {
                userPrompt = userPrompt + " Please enter a new, unused character name.";
            }

            let input = prompt(userPrompt, "Hurdy Gurdy");

            userHitCancel = input === null;

            if (!userHitCancel) {
                // They didn't hit cancel, so unless something else went wrong, this is fine.

                nameIsValid = true;
                let stringInput: string = input as string;

                if (!this._validCharnameCharacters.test(stringInput)) {
                    nameIsValid = false;
                    userUsedInvalidCharacters = true;
                }
                if (stringInput in parsedStorage) {
                    nameIsValid = false;
                    userEnteredExistingName = true;
                }

                if (nameIsValid) {
                    charName = stringInput;
                }
            }
        }

        // Reset all of the inventory lists. A new character should start with nothing.
        this.InitializeLists();

        // Save this new character to the cache.
        this.SaveToCache(charName)

        // Now tell the inventory to use the new character. When we set the character name, that makes
        // us switch to the 
        this.CharacterName = charName;
    }

    /**
     * @description Adds a given item to the inventory. An item key and type must be provided. Listeners
     * will be notified when this function is called.
     * @param key The key for the given item to add to the inventory.
     * @param type The type of item that is being added to the inventory.
     */
    private AddItemInternal(key: string, type: TItemType) {
        switch (type) {
            case "Armor":
                this.AddToList(this._armor, ItemSource.GetArmor(key));
                break;
            // case "Weapon":
            //     this.AddToList(this._weapons, ItemSource.GetItem(key, "Weapon"));
            //     break;
            case "Potion":
                this.AddToList(this._potions, ItemSource.GetPotion(key));
                break;
            case "Wondrous":
                this.AddToList(this._wondrous, ItemSource.GetWondrous(key));
                break;
            default:
                console.log("Adding item!");
                var item: IItem | undefined = ItemSource.GetItem(key, type);
                if (!this._items.has(type)) {
                    console.log("Adding an item to an item type that doesn't exist yet.");
                    this._items.set(type, []);
                }
                if (item !== undefined) {
                    console.log("Item was found! Adding item to the list.");
                    this._items.get(type)?.push(item);
                }
                break;
        }

        this.SaveToCache(this.CharacterName);
    }

    /**
     * @description Adds a given item to the inventory. An item key and type must be provided. Listeners
     * will be notified when this function is called.
     * @param key The key for the given item to add to the inventory.
     * @param type The type of item that is being added to the inventory.
     */
    public AddItem(key: string, type: TItemType) {
        this.AddItemInternal(key, type);
        this.SaveToCache(this.CharacterName);
    }

    /**
     * @description Removes a given item from the inventory. An item key and type must be provided. Listeners
     * will be notified when this function is called.
     * @param key The key for the given item to remove from the inventory.
     * @param type The type of item that is being removed from the inventory.
     */
    public RemoveItem(key: string, type: TItemType) {
        switch (type) {
            case "Armor":
                this.RemoveFromList(this._armor, ItemSource.GetArmor(key));
                break;
            // case "Weapon":
            //     this.RemoveFromList(this._weapons, ItemSource.GetItem(key, "Weapon"));
            //     break;
            case "Potion":
                this.RemoveFromList(this._potions, ItemSource.GetPotion(key));
                break;
            case "Wondrous":
                this.RemoveFromList(this._wondrous, ItemSource.GetWondrous(key));
                break;
            default:
                if (this._items.has(type)) {
                    var itemsOfType: IItem[] = this._items.get(type) as IItem[];
                    
                    for(let i = 0; i < itemsOfType.length; i++) {
                        if (itemsOfType[i].key === key) {
                            itemsOfType.splice(i, 1);
                            break;
                        }
                    }

                    this._items.set(type, itemsOfType);
                }
                break;
        }

        this.SaveToCache(this.CharacterName);
    }

    /**
     * @description Adds the provided item to the provided list, given that the item is not undefined.
     * @param listToAddTo The list to add the item to.
     * @param item The item to add to the list.
     */
    private AddToList<T extends IItem>(listToAddTo: ObservableList<T>, item: T | undefined) {
        if (item != undefined) {
            listToAddTo.AddItem(item);
        }
    }

    /**
     * @description Removes the provided item from the provided list, given that the item is not undefined.
     * @param listToAddTo The list to remove the item from.
     * @param item The item to remove from the list.
     */
    private RemoveFromList<T extends IItem>(listToAddTo: ObservableList<T>, item: T | undefined) {
        if (item != undefined) {
            listToAddTo.RemoveItem(item);
        }
    }

    /**
     * @description Saves the current inventory information to the cache. This should be replaced with a 
     * logging call to an AWS database.
     * @param charName The name of the character that this information is being saved to.
     */
    private SaveToCache(charName: string): void {
        console.log("Saving items to the cache.");

        var cacheItems: {[key: string]: string[]} = {};

        for(let [key, value] of this._items) {
            console.log(`cacheItems: ${JSON.stringify(cacheItems)}`);
            cacheItems[key] = value.map((item) => item.key);
            console.log(`cacheItems: ${JSON.stringify(cacheItems)}`);
        }

        // console.log("Adding items to a list to be stored.");
        // // https://stackoverflow.com/questions/37699320/iterating-over-typescript-map
        // this._items.forEach((value: IItem[], key: TItemType) => {
        //     let keysList: string[] = value.map((item) => item.key);

        //     console.log(`Adding items to list ${key}: ${keysList}`);
        //     console.log(`Before: ${JSON.stringify(cacheItems)}`);
        //     cacheItems.set(key, keysList);
        //     console.log(`After: ${JSON.stringify(cacheItems)}`);
        // });

        var inventoryModel: TInventoryModel = {
            characterName: charName,
            armorKeys: this._armor.GetItems().map((item) => { return item.key }),
            potionKeys: this._potions.GetItems().map((item) => { return item.key }),
            // weaponKeys: this._weapons.GetItems().map((item) => { return item.key }),
            wondrousKeys: this._wondrous.GetItems().map((item) => { return item.key }),
            items: cacheItems
        };

        console.log(`New char inventory: ${JSON.stringify(inventoryModel)}`);

        var parsedStorage: TInventoryModelStorage = this.GetInventoryStorage();

        parsedStorage[charName] = inventoryModel;
        var jsonStorage = JSON.stringify(parsedStorage);
        console.log(`Saving ${jsonStorage}`);

        localStorage.setItem(EStorageType.Inventory, jsonStorage);
    }

    /**
     * @description Gets the inventory storage information from the cache.
     */
    private GetInventoryStorage(): TInventoryModelStorage {
        var parsedStorage: TInventoryModelStorage = {};
        var itemStorage = localStorage.getItem(EStorageType.Inventory);

        if (itemStorage !== null) {
            var storageString: string = itemStorage as string;
            parsedStorage = JSON.parse(storageString) as TInventoryModelStorage;
        }

        return parsedStorage;
    }

    /**
     * @description Updates the current inventory using the cache. Clears the inventory then 
     */
    private UpdateInventoryUsingCache(): void {
        /*
         * Each item type is stored in the cache under the key:
         *  {CharName}_{TItemType}
         * 
         * This means that we need to get a string array from each of these fields, and lookup what the
         * ItemSource says these items are. In short, once we get this array we can iterate over each item
         * and call "AddItem" for each key.
         */
        var parsedStorage: TInventoryModelStorage = this.GetInventoryStorage();
        var inventoryModel: TInventoryModel;

        if (this.CharacterName in parsedStorage) {
            inventoryModel = parsedStorage[this.CharacterName];
        }
        else {
            // This shouldn't happen, but if it does, save what's in the inventory under the character's
            // name to the cache and continue on.
            // this.SaveToCache(this.CharacterName);
            // parsedStorage = this.GetInventoryStorage();
            console.error(`Current character ${this.CharacterName} is not saved in the cache when updating.`);

            inventoryModel = {
                characterName: "",
                armorKeys: [],
                potionKeys: [],
                wondrousKeys: [],
                items: {}
            };
        }

        this.InitializeLists();

        inventoryModel.armorKeys.forEach((item) => {
            this.AddToList(this._armor, ItemSource.GetArmor(item));
        });

        inventoryModel.potionKeys.forEach((item) => {
            this.AddToList(this._potions, ItemSource.GetPotion(item));
        });

        // inventoryModel.weaponKeys.forEach((item) => {
        //     this.AddToList(this._weapons, ItemSource.GetItem(item, "Weapon"));
        // });

        inventoryModel.wondrousKeys.forEach((item) => {
            this.AddToList(this._wondrous, ItemSource.GetWondrous(item));
        });

        Object.keys(inventoryModel.items).forEach((itemType) => {
            inventoryModel.items[itemType].forEach((item) => {
                this.AddItemInternal(item, itemType as TItemType);
            })
        })
    }

    /**
     * @description Sets the item lists to their default, empty, states.
     */
    private InitializeLists(): void {
        this._armor = new ObservableList<ItemArmor>();
        this._potions = new ObservableList<ItemPotion>();
        // this._weapons = new ObservableList<IItem>();
        this._wondrous = new ObservableList<ItemWondrous>();
    }
}
