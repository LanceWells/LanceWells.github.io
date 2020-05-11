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

    public static GetInstance() {
        if (!this._instance) {
            this._instance = new CharacterStateManager();
        }
        return this._instance;
    }

    public AddObserver(observer: CharacterStateObserver) {
        let existingObserver: CharacterStateObserver | undefined = this._observers.find(obs => obs === observer);

        if (existingObserver === undefined) {
            this._observers.push(observer);
        }
    }

    public RemoveObserver(observer: CharacterStateObserver) {
        let existingObserver: number | undefined = this._observers.findIndex(obs => obs === observer);
        
        if (existingObserver === undefined) {
            this._observers.splice(existingObserver, 1);
        }
    }

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
     * @description Called in order to modify the current character data, and submit that data to the server.
     * @param charData 
     */
    public async UploadCharacterData(charData: PlayerCharacterData) {
        let accessGranted: boolean = await UserDataAuth.GetInstance().CheckForAccess();

        if (accessGranted) {
            // this.SetCharacter(charData);
            await PlayerInventoryService.UpdateCharacterData(charData);
        }
    }

    private NotifyObservers(): void {
        this._observers.forEach(obs => obs(this._currentCharacter))
    }

    /**
     * @description Called in order to update the local static object that tracks the character's state.
     * @param charData 
     */
    private SetCharacter(charData: PlayerCharacterData | undefined) {
        this._currentCharacter = charData;
        this.NotifyObservers();
    }

    private constructor() {
        this._currentCharListener = undefined;
    }
}
