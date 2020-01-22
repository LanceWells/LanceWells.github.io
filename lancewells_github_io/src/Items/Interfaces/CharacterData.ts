import { ICharacterDataSerializable } from './ICharacterDataSerializable';
import { IItem, IItemJson } from './IItem';

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
        var assignedObject: CharacterData =  Object.assign(retVal, parsedJson);

        return assignedObject;
    }
}
