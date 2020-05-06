import { PlayerInventoryService } from './PlayerInventoryService';
import { PlayerCharacterData } from '../Types/PlayerCharacterData';
import { UserDataAuth } from './UserDataAuth';

export type CharacterStateObserver = (charData: PlayerCharacterData | undefined) => void;

export class CharacterStateManager {
    private _observers: CharacterStateObserver[] = [];

    private static _instance: CharacterStateManager;

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

    private NotifyObservers(): void {
        this._observers.forEach(obs => obs(this._currentCharacter))
    }

    public async GetCurrentStaticCharacterData(): Promise<PlayerCharacterData | undefined> {
        let accessGranted: boolean = await UserDataAuth.GetInstance().CheckForAccess();

        if (accessGranted) {
            // First, verify that the current character has been loaded. If it hasn't, load up the first
            // applicable character.
            if (this._currentCharacter === undefined) {
                let playerName: string | null = PlayerInventoryService.GetCurrentCharacterName();

                // If we have a player name in local storage, try loading that first.
                if (playerName) {
                    this._currentCharacter = await PlayerInventoryService.FetchCharacterData(playerName);
                }
                else {
                    this._currentCharacter = await PlayerInventoryService.GetDefaultCharacter();
                }
            }
        }

        return this._currentCharacter;
    }

    /**
     * @description Called in order to update the local static object that tracks the character's state.
     * @param charData 
     */
    public async ChangeStaticCharacterData(charData: PlayerCharacterData | undefined) {
        this._currentCharacter = charData;
        this.NotifyObservers();
    }

    /**
     * @description Called in order to modify the current character data, and submit that data to the server.
     * @param charData 
     */
    public async UploadCharacterData(charData: PlayerCharacterData) {
        let accessGranted: boolean = await UserDataAuth.GetInstance().CheckForAccess();

        if (accessGranted) {
            this.ChangeStaticCharacterData(charData);
            PlayerInventoryService.UpdateCharacterData(charData);
        }
    }

    private _currentCharacter: PlayerCharacterData | undefined = undefined;

    private constructor() {}
}
