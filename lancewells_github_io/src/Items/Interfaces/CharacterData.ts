import { ICharacterDataSerializable } from './ICharacterDataSerializable';
import { IItem, IItemJson } from './IItem';
import { ItemSource } from '../Classes/ItemSource';

export class CharacterData implements ICharacterDataSerializable {
    characterName: string = "";
    itemData: IItem[] = [];

    public Serialize(): string {
        var jsonItems: IItemJson[] = this.itemData.map(item => {
            return item as IItemJson;
        })

        var serializedString: ICharacterDataSerializable = {
            characterName: this.characterName,
            itemData: jsonItems
        };

        return JSON.stringify(serializedString);
    }

    public static DeSerialize(serializedData: string): CharacterData {
        var retVal: CharacterData = new CharacterData();
        var parsedJson: any = JSON.parse(serializedData);

        // This works to get the character details, but doesn't strongly type or construct anything.
        var assignedObject: CharacterData =  Object.assign(retVal, parsedJson);

        // Fetch the actual item we're planning to use from the item source. This lets us pass the
        // full-blown item around.
        var createdItems: (IItem | undefined)[] = assignedObject.itemData.map(i => {
            return ItemSource.GetItem(i.key, i.type);
        });

        // Filter out any undefined items.
        assignedObject.itemData = createdItems.filter(i => i !== undefined) as IItem[];

        return assignedObject;
    }
}
