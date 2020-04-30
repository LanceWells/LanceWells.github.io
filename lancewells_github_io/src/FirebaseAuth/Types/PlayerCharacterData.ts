import { IItemKey } from "../../Items/Interfaces/IItem";
import { PartType } from "../../CharacterImage/Enums/PartType";

export class PlayerCharacterData {
    public Name: string;
    public Copper: number;
    public Items: IItemKey[];
    public Images: Map<PartType, string>;
    public BorderColor: string;

    public constructor(name: string, copper: number, items: IItemKey[], images: Map<PartType, string>, borderColor: string) {
        this.Name = name;
        this.Copper = copper;
        this.Items = items;
        this.Images = images;
        this.BorderColor = borderColor;
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
