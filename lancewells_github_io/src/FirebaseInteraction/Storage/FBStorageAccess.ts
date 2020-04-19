import firebase, { storage } from 'firebase';
import { CharacterSize } from './CharacterSize';
import { BodyType } from './BodyType';
import { UserDataAuth } from '../../Login/Classes/UserDataAuth';
import { PartType } from './PartType';

type urlType = string | null;

export class FBStorageAccess
{
    /**
     * 
     * @param charSize 
     * @param validBodyTypes 
     * @param partType 
     */
    public static async GetCharacterImagePaths(charSize: CharacterSize, validBodyTypes: BodyType[], partType: PartType): Promise<string[]>
    {
        // Getting this instance initializes all firebase operations, which we need before getting any files
        // from cloud storage.
        let userAuth: UserDataAuth = UserDataAuth.GetInstance();

        // Get a reference to our storage service. This effectively 'navigates' to the root directory of the
        // storage service.
        let storageService: firebase.storage.Storage = firebase.storage();
        let storageRef: firebase.storage.Reference = storageService.ref();

        let characterFolders: string[] = validBodyTypes.map(vbt => {
            return this.GetCharacterImageFolder(charSize, vbt, partType);
        });

        let imageReferences: firebase.storage.Reference[] = [];

        for (let i: number = 0; i < characterFolders.length; i++)
        {
            let imageResult: storage.ListResult = await storageRef.child(characterFolders[i]).listAll();
            let folderReferences: firebase.storage.Reference[] = imageResult.items;
            imageReferences = imageReferences.concat(folderReferences);
        }

        let imageUrls: urlType[] = await Promise.all(
            imageReferences.map(i => FBStorageAccess.GetDownloadUrl(i))
        );

        // Filter out the URLs so that we don't pass back any nulls. If some images aren't able to be
        // resolved, then that should be handled in some FUTURE: work. For now, this shouldn't be a major
        // issue, so it's not worth tracking intensively.
        let filteredUrls: string[] = imageUrls.filter(u => u !== null) as string[];
        return filteredUrls;
    }

    /**
     * 
     * @param charSize 
     * @param validBodyType 
     * @param partType 
     */
    private static GetCharacterImageFolder(charSize: CharacterSize, validBodyType: BodyType, partType: PartType): string
    {
        let folderPath: string = `${charSize}/${partType}/${validBodyType}`;
        return folderPath;
    }

    /**
     * 
     * @param imageReference 
     * @reference https://firebase.google.com/docs/storage/web/download-files
     */
    private static async GetDownloadUrl(imageReference: firebase.storage.Reference): Promise<urlType>
    {
        let retVal: string | null = null;
        await imageReference.getDownloadURL()
            .then(resolved => {
                console.log("Succesfully got download url." + resolved);
                retVal = resolved;
            })
            .catch(reason => {
                console.error("Failed to get download url." + reason);
            });
        return retVal;
    }
}
