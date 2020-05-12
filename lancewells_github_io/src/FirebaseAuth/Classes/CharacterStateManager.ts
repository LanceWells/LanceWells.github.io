import { PlayerInventoryService } from './PlayerInventoryService';
import { PlayerCharacterData } from '../Types/PlayerCharacterData';
import { UserDataAuth } from './UserDataAuth';
import { SnapshotListener } from '../Types/SnapshotListener';

export type CharacterStateObserver = (charData: PlayerCharacterData | undefined) => void;

export class CharacterStateManager {
    private _observers: CharacterStateObserver[] = [];
    private _currentCharListener: SnapshotListener | undefined;
    private static _instance: CharacterStateManager;
    private _currentCharacter: PlayerCharacterData | undefined = undefined;

    /**
     * Gets the static instance of this class.
     */
    public static GetInstance() {
        if (!this._instance) {
            this._instance = new CharacterStateManager();
        }
        return this._instance;
    }

    /**
     * Adds the provided observer. This observer will be notified every time that the current character data
     * receives an update.
     * @param observer The observer to add.
     */
    public AddObserver(observer: CharacterStateObserver) {
        let existingObserver: CharacterStateObserver | undefined = this._observers.find(obs => obs === observer);

        if (existingObserver === undefined) {
            this._observers.push(observer);
        }
    }

    /**
     * Removes the provided observer. This observier will no longer receive updates.
     * @param observer The observer to remove.
     */
    public RemoveObserver(observer: CharacterStateObserver) {
        let existingObserver: number | undefined = this._observers.findIndex(obs => obs === observer);
        
        if (existingObserver === undefined) {
            this._observers.splice(existingObserver, 1);
        }
    }

    /**
     * Gets the 'current' character. This will be any loaded characters or, in lieu of any loaded characters,
     * the last-loaded character. The last loaded character is stored in local storage and fetched from the
     * player inventory service. If there is no stored player, this attempts to grab the first character that
     * the user created.
     */
    public async GetCharacter(): Promise<PlayerCharacterData | undefined> {
        let accessGranted: boolean = await UserDataAuth.GetInstance().CheckForAccess();

        if (accessGranted) {
            // First, verify that the current character has been loaded. If it hasn't, load up the first
            // applicable character.
            if (this._currentCharacter === undefined) {
                let playerName: string | null = PlayerInventoryService.GetCurrentCharacterName();
                let currentChar: PlayerCharacterData | undefined;

                // If we have a player name in local storage, try loading that first.
                if (playerName) {
                    currentChar = await PlayerInventoryService.FetchCharacterData(playerName);
                }
                else {
                    currentChar = await PlayerInventoryService.GetDefaultCharacter();
                }

                this.ChangeCharacter(currentChar);
            }
        }

        return this._currentCharacter;
    }

    /**
     * Changes the loaded character data to the provided character data, and begins to listen for changes on
     * this specific character. Note that this does not modify the stored character data, that should be
     * done via UploadCharacterData.
     * @param charData The character data to change to.
     */
    public async ChangeCharacter(charData: PlayerCharacterData | undefined) {
        if (this._currentCharListener !== undefined) {
            this._currentCharListener();
        }

        if (charData !== undefined) {
            this._currentCharListener = PlayerInventoryService.ListenToCharacterUpdates(charData.Name, this.SetCharacter.bind(this));
        }

        this.SetCharacter(charData);
    }

    /**
     * Called to modify the stored character data on the remote. Note that this does not change the active
     * character, it only uploads character data. Changing the character must be performed via 
     * ChangeCharacter.
     * @param charData The character data to upload to the server. note that the character that is changed is
     * the character under the "Name" property of charData. Also note that this will not create a character,
     * it will only update an existing one.
     */
    public async UploadCharacterData(charData: PlayerCharacterData) {
        let accessGranted: boolean = await UserDataAuth.GetInstance().CheckForAccess();

        if (accessGranted) {
            await PlayerInventoryService.UpdateCharacterData(charData);
        }
    }

    /**
     * Called in order to notify any listeners that the current character has changed. This can mean changes
     * to the data for a character, or changes to the character's information.
     */
    private NotifyObservers(): void {
        this._observers.forEach(obs => obs(this._currentCharacter))
    }

    /**
     * Called in order to update the local static object that tracks the character's state. This
     * should only be modified internally in this class, as it does not establish the necessary listeners for
     * changes to this state.
     * @param charData The character data to set for the local, static object.
     */
    private SetCharacter(charData: PlayerCharacterData | undefined) {
        this._currentCharacter = charData;
        this.NotifyObservers();
    }

    /**
     * Creates a new instance of this object. Note that this is private to ensure a singleton schema.
     */
    private constructor() {
        this._currentCharListener = undefined;
    }
}
