import { UserDataAuth } from './UserDataAuth';
import { firestore } from 'firebase';
import { PlayerCharacterData } from '../Types/PlayerCharacterData';
import { IItemKey } from '../../Items/Interfaces/IItem';
import { PartType } from '../../CharacterImage/Enums/PartType';

export class PlayerInventoryService {
    private static readonly collection_userWritable: string = "userWritable";
    private static readonly document_playerInventory: string = "playerInventory";
    private static readonly storage_currentCharacter: string = "currentCharacter";

    private static PlayerCharacterDataConverter: firestore.FirestoreDataConverter<PlayerCharacterData> = {
        toFirestore: (playerCharacterData: PlayerCharacterData): firestore.DocumentData => {
            // https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map

            let images: [PartType, string][] = Array.from(playerCharacterData.Images.entries());
            let imagesStr: string = JSON.stringify(images);

            return {
                name: playerCharacterData.Name,
                copper: playerCharacterData.Copper,
                items: playerCharacterData.GetItemsAsStringArray(),
                images: imagesStr,
                borderColor: playerCharacterData.BorderColor
            }
        },
        fromFirestore: (snapshot, options): PlayerCharacterData => {
            let snapshotData = snapshot.data(options);

            let playerName: string = snapshotData.name;
            let playerCopper: number = snapshotData.copper;
            let playerItemData: string[] = snapshotData.items;
            let playerImagesString: string = snapshotData.images;
            let playerImages: Map<PartType, string> = new Map(JSON.parse(playerImagesString));
            let playerBorder: string = snapshotData.borderColor;

            let playerItems: IItemKey[] = PlayerCharacterData.GetStringArrayAsItems(playerItemData);

            let playerData: PlayerCharacterData = new PlayerCharacterData(
                playerName,
                playerCopper,
                playerItems,
                playerImages,
                playerBorder);

            return playerData;
        }
    }

    public static async CreateCharacterData(characterData: PlayerCharacterData): Promise<void> {
        let uid: string | undefined = UserDataAuth.GetInstance().GetUid();

        if (uid !== undefined) {
            await firestore()
                .collection(this.collection_userWritable)
                .doc(this.document_playerInventory)
                .collection(uid)
                .doc(characterData.Name)
                .withConverter(PlayerInventoryService.PlayerCharacterDataConverter)
                .set(characterData)
                .catch(reason => {
                    console.error(reason);
                });
        }
    }

    public static async UpdateCharacterData(characterData: PlayerCharacterData): Promise<void> {
        let uid: string | undefined = UserDataAuth.GetInstance().GetUid();

        // I'm not certain why, but the 'withConverter' option doesn't appear to work the same for .update as
        // it does for .set. Just use the converter in a brute-force method instead since this seems to work.
        let charDataDocument = PlayerInventoryService.PlayerCharacterDataConverter.toFirestore(characterData);
        
        if (uid !== undefined) {
            await firestore()
                .collection(this.collection_userWritable)
                .doc(this.document_playerInventory)
                .collection(uid)
                .doc(characterData.Name)
                .update(charDataDocument)
                .catch(reason => {
                    console.error(reason);
                });
        }
    }

    public static async FetchCharacterData(playerName: string): Promise<PlayerCharacterData | undefined> {
        let response: PlayerCharacterData | undefined = undefined;
        let uid: string | undefined = UserDataAuth.GetInstance().GetUid();

        if (uid !== undefined) {
            let playerDataRef = firestore()
                .collection(this.collection_userWritable)
                .doc(this.document_playerInventory)
                .collection(uid)
                .doc(playerName);

            await playerDataRef
                .withConverter(PlayerInventoryService.PlayerCharacterDataConverter)
                .get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                        response = docSnapshot.data();
                    }
                    else {
                        console.error(`Could not find character document for ${playerName}.`);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        return response;
    }

    public static async GetDefaultCharacter(): Promise<PlayerCharacterData | undefined> {
        let response: PlayerCharacterData | undefined = undefined;
        let uid: string | undefined = UserDataAuth.GetInstance().GetUid();

        if (uid !== undefined) {
            let playerDataRef = firestore()
                .collection(this.collection_userWritable)
                .doc(this.document_playerInventory)
                .collection(uid)
                .limit(1);

            await playerDataRef
                .withConverter(PlayerInventoryService.PlayerCharacterDataConverter)
                .get()
                .then(docSnapshot => {
                    if (!docSnapshot.empty) {
                        response = docSnapshot.docs[0].data();
                    }
                    else {
                        console.error(`Could not find a default character.`);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        return response;
    }

    public static async FetchAllCharacters(): Promise<PlayerCharacterData[]> {
        let uid: string | undefined = UserDataAuth.GetInstance().GetUid();
        let allCharData: PlayerCharacterData[] = [];

        if (uid !== undefined) {
            let playerDataRef = firestore()
                .collection(this.collection_userWritable)
                .doc(this.document_playerInventory)
                .collection(uid);

            await playerDataRef
                .withConverter(PlayerInventoryService.PlayerCharacterDataConverter)
                .get()
                .then(docSnapshot => {
                    // Calling .data() doesn't cost anything extra in terms of database reads, so go ahead and
                    // get the list of characters as the full objects regardless.
                    docSnapshot.forEach(charData => {
                        let newCharData = charData.data();
                        allCharData.push(newCharData);
                    });
                })
                .catch(reason => {
                    console.error(reason);
                });
        }

        return allCharData;
    }

    public static SetCurrentCharacter(charName: string) {
        localStorage.setItem(PlayerInventoryService.storage_currentCharacter, charName);
    }

    public static GetCurrentCharacterName(): string | null {
        return localStorage.getItem(PlayerInventoryService.storage_currentCharacter);
    }

    public static async GetCurrentCharacter(): Promise<PlayerCharacterData | undefined> {
        let charName: string | null = PlayerInventoryService.GetCurrentCharacterName();

        if (!charName) {
            return undefined;
        }

        return await PlayerInventoryService.FetchCharacterData(charName as string);
    }
}
