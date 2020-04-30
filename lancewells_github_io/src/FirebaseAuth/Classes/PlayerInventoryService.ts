import { UserDataAuth } from './UserDataAuth';
import { firestore } from 'firebase';
import { PlayerCharacterData } from '../Types/PlayerCharacterData';
import { IItemKey } from '../../Items/Interfaces/IItem';

export class PlayerInventoryService {
    private static collection_userWritable: string = "userWritable";
    private static document_playerInventory: string = "playerInventory";

    private static PlayerCharacterDataConverter: firestore.FirestoreDataConverter<PlayerCharacterData> = {
        toFirestore: (playerCharacterData: PlayerCharacterData): firestore.DocumentData => {
            return {
                name: playerCharacterData.Name,
                copper: playerCharacterData.Copper,
                items: playerCharacterData.GetItemsAsStringArray()
            }
        },
        fromFirestore: (snapshot, options): PlayerCharacterData => {
            let snapshotData = snapshot.data(options);
            
            let playerName: string = snapshotData.name;
            let playerCopper: number = snapshotData.copper;
            let playerItemData: string[] = snapshotData.items;
            let playerItems: IItemKey[] = PlayerCharacterData.GetStringArrayAsItems(playerItemData);

            let playerData: PlayerCharacterData = new PlayerCharacterData(
                playerName,
                playerCopper,
                playerItems)

            return playerData;
        }
    }

    public static async SaveCharacterData(characterData: PlayerCharacterData): Promise<void> {
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
}
