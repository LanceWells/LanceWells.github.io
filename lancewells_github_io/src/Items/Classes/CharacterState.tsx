import { UserDataAuth } from '../../Login/Classes/UserDataAuth'
import { CharacterData } from '../Interfaces/CharacterData';
import { IItem } from '../Interfaces/IItem';
import { TItemType } from '../Types/TItemType';

export class CharacterState {
    // https://regex101.com/r/AJU90m/1
    private readonly _validCharnameCharacters: RegExp = /^[a-z0-9 ]{1,}$/i;
    private static _instance: CharacterState
    private onInventoryChanged_listeners: (() => void)[] = [];
    private allCharactersData: CharacterData[] = [];
    private static readonly currentCharacterStorage = "charname";
    private _currentCharacter: string = "";

    /**
     * Creates a new instance of this class.
     */
    private constructor() {
        const handleUpdatedInventory = (userData: CharacterData[]) => {
            this.UpdateInventory(userData);
        };

        UserDataAuth.GetInstance().onUserDataChanged(handleUpdatedInventory.bind(this));

        var storedCharName: string | null;
        storedCharName = localStorage.getItem(CharacterState.currentCharacterStorage);

        if (storedCharName) {
            this._currentCharacter = storedCharName;
        }

        UserDataAuth.GetInstance().FetchCharacterData().then(charData => {
            this.allCharactersData = charData;

            // If no character name is defined, grab the first character that we can find, and use that
            // instead of no name at all.
            if (this.allCharactersData.length <= 0) {
                this.AddCharacter();
            }
            else if (this._currentCharacter === "") {

                var firstCharacterInList = this.allCharactersData.find(c => c.characterName !== "");

                if (firstCharacterInList !== undefined) {
                    this._currentCharacter = firstCharacterInList.characterName;
                }
            }

            this.UpdateInventory(charData);
        })
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

        var atLeastOneValidNameExists: Boolean = this.allCharactersData.length > 0;

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
                if (this.allCharactersData.some(c => c.characterName === stringInput)) {
                    nameIsValid = false;
                    userEnteredExistingName = true;
                }
                if (nameIsValid) {
                    charName = stringInput;
                }
            }
        }

        // Save this as a new character.
        var newCharData: CharacterData = new CharacterData();
        newCharData.characterName = charName;
        this.allCharactersData.push(newCharData);

        // Switch to using the new character.
        this._currentCharacter = charName;

        // Save the new character to the database!
        UserDataAuth.GetInstance().UpdateCharacterData(this.allCharactersData);
    }

    /**
     * Gets the name of the currently selected character.
     */
    public get CurrentCharacter(): string {
        return this._currentCharacter;
    }

    /**
     * Sets the name for the currently selected character.
     */
    public set CurrentCharacter(newCharName: string) {
        this._currentCharacter = newCharName;

        // If the current character doesn't already exist, go ahead and give it some new information.
        // This should behave similar to dictionaries in C#.
        if (!this.allCharactersData.some(c => c.characterName === newCharName)) {
            var newCharData = new CharacterData();
            newCharData.characterName = newCharName;

            this.allCharactersData.push(newCharData);
        }

        localStorage.setItem(CharacterState.currentCharacterStorage, this._currentCharacter);
    }

    /**
     * Gets the singleton instance of this class.
     */
    public static GetInstance(): CharacterState {
        if (!this._instance) {
            this._instance = new CharacterState()
        }
        return this._instance;
    }

    /**
     * Gets the inventory from the currently selected character.
     */
    public GetCharacterInventory(): CharacterData | undefined {
        return this.allCharactersData.find(
            data => data.characterName === this._currentCharacter);
    }

    /**
     * Adds an item to the currently selected character.
     * @param itemData The item to add.
     */
    public AddItemToCurrentCharacter(itemData: IItem): boolean {
        return this.AddItem(this._currentCharacter, itemData);
    }

    /**
     * Adds an item to the inventory of the specified character.
     * @param charName The name of the character that the data needs to be added to.
     * @param itemData The item data that will be added.
     */
    public AddItem(charName: string, itemData: IItem): boolean {
        var didAdd: boolean = false;
        
        var charData: CharacterData | undefined = this.allCharactersData.find(
            data => data.characterName === charName);

        if (charData !== undefined && itemData !== undefined) {
            charData.itemData.push(itemData);
            didAdd = true;
        }

        /*
         * Save the data. DO NOT TRY TO UPDATE HERE. The workflow should be:
         *      -> An item gets added.
         *      -> The backend gets notified via the firebase auth class.
         *      -> The firebase auth class notifies THIS class that something is going to be updated.
         * 
         * Why?
         * 
         * The answer is that we only want to update when the server tells us that the add was fine, and
         * not when 'just we' say that things are okay. This has several advantages:
         *      1. If we update our inventory (on a mobile device, for example), we can see a live update
         *         here.
         * 
         *      2. Items are only added when some server validation applies (granted, firebase will 
         *         notify us that things have changed before a handshake by default, but this behavior is
         *         configurable).
         */
        UserDataAuth.GetInstance().UpdateCharacterData(this.allCharactersData);

        return didAdd;
    }

    /**
     * Removes the specified item from the current character. Uses IItem's comparison string to evaluate
     * equality.
     * @param itemData The item that needs to be removed from the current character.
     */
    public RemoveItemFromCurrentCharacter(itemData: IItem): boolean {
        return this.RemoveItem(this._currentCharacter, itemData);
    }

    /**
     * Removes the specified item from the specified character. Uses IItem's comparison string to evaluate
     * equality.
     * @param charName The name of the character to remove an item from.
     * @param itemData The item that needs to be removed from the specified character.
     */
    public RemoveItem(charName: string, itemData: IItem): boolean {
        var didRemove: boolean = false;
        var serializedItem: string = itemData.GetEqualityString();
        
        var charData: CharacterData | undefined = this.allCharactersData.find(
            data => data.characterName === charName);

        if (charData !== undefined) {
            var foundMatch: boolean = false;
            var i = 0;
            for(i = 0; i < charData.itemData.length; i++) {
                if (charData.itemData[i].GetEqualityString() === serializedItem) {
                    foundMatch = true;
                    break;
                }
            }

            if (foundMatch) {
                charData.itemData = charData.itemData.splice(i);
                didRemove = true;
            }
        }

        return didRemove;
    }

    /**
     * Gets a series of items from the currently-selected character.
     * @param itemType The type of item that we need to get from the current character.
     */
    public GetCurrentItemsOfType(itemType: TItemType): IItem[] {
        return this.GetItemsOfType(this._currentCharacter, itemType);
    }

    /**
     * Gets items of the specified type from the specified character.
     * @param charName The character whose inventory we need to search.
     * @param itemType The type of item that we need to get from the character.
     */
    public GetItemsOfType(charName: string, itemType: TItemType): IItem[] {
        var items: IItem[] = [];

        var charData: CharacterData | undefined = this.allCharactersData.find(
            data => data.characterName === charName);

        if (charData !== undefined) {
            items = charData.itemData.filter(item => item.type === itemType);
        }

        return items;
    }

    /**
     * Provides a listener for whenever the inventory that is stored by this class changes.
     * @param e 
     */
    public onInventoryChanged(e: () => void): void {
        this.onInventoryChanged_listeners.push(e);
    }

    /**
     * Updates the inventory that is stored by this class. Should notify any listeners once the inventory
     * has been updated and applied.
     * @param userData The user data that this class will provide a newly-updated inventory for.
     */
    private UpdateInventory(userData: CharacterData[]): void {
        this.allCharactersData = userData;

        // Notify listeners that we've CHAAAAANGED.
        this.onUserDataChanged_notify();
    }

    /**
     * Notifies any listeners that the user data has changed.
     */
    private onUserDataChanged_notify() {
        this.onInventoryChanged_listeners.forEach(e => e());
    }
}
