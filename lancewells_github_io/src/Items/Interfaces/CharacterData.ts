import { ICharacterDataSerializable } from './ICharacterDataSerializable';
import { IItem, IItemJson } from './IItem';
import { ItemSource } from '../Classes/ItemSource';

export class CharacterData implements ICharacterDataSerializable {
    characterName: string = "";
    inventory: IItem[] = [];

    public Serialize(): string {
        var jsonItems: IItemJson[] = this.inventory.map(item => {
            return item as IItemJson;
        })

        var serializedString: ICharacterDataSerializable = {
            characterName: this.characterName,
            inventory: jsonItems
        };

        return JSON.stringify(serializedString);
    }

    /**
     * Adds an item to this character's inventory.
     * @param itemData The new item to add to this character's data.
     */
    public AddItem(itemData: IItem): void {
        this.inventory.push(itemData);
    }

    /**
     * Removes an item from this character's inventory.
     * @param itemData The item to remove.
     */
    public RemoveItem(itemData: IItem): boolean {
        var didRemove: boolean = false;
        var serializedItem: string = itemData.GetEqualityString();

        var foundMatch: boolean = false;
        var i = 0;
        for (i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].GetEqualityString() === serializedItem) {
                foundMatch = true;
                break;
            }
        }

        if (foundMatch) {
            this.inventory.splice(i, 1);
            didRemove = true;
        }

        return didRemove;
    }

    public static DeSerialize(serializedData: string): CharacterData {
        var retVal: CharacterData = new CharacterData();
        var parsedJson: any = JSON.parse(serializedData);

        // This works to get the character details, but doesn't strongly type or construct anything.
        var assignedObject: CharacterData =  Object.assign(retVal, parsedJson);

        // Fetch the actual item we're planning to use from the item source. This lets us pass the
        // full-blown item around.
        var createdItems: (IItem | undefined)[] = assignedObject.inventory.map(i => {
            return ItemSource.GetItem(i.key, i.type);
        });

        // Filter out any undefined items.
        assignedObject.inventory = createdItems.filter(i => i !== undefined) as IItem[];

        return assignedObject;
    }
}
