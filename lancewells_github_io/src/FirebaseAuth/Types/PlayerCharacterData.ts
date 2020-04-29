import { IItemKey } from "../../Items/Interfaces/IItem";

export class PlayerCharacterData {
    public Name: string;
    public Copper: number;
    public Items: IItemKey[];

    public constructor(name: string, copper: number, items: IItemKey[]) {
        this.Name = name;
        this.Copper = copper;
        this.Items = items;
    }

    public GetItemsAsStringArray(): string[] {
        return this.Items.map(item => JSON.stringify(item));
    }

    public static GetStringArrayAsItems(itemJson: string[]): IItemKey[] {
        let items: IItemKey[] = itemJson
            .map(itemJson => JSON.parse(itemJson) as IItemKey | undefined)
            .filter(item => item !== undefined) as IItemKey[];

        return items;
    }
}
