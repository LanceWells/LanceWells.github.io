import { IItemKey } from "../../ItemData/Interfaces/IItemKey";
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';

export class PlayerCharacterData {
    public Name: string;
    public Copper: number;
    public Items: IItemKey[];
    public CharLayout: CharImageLayout;
    public BorderColor: string;

    public constructor(name: string, copper: number, items: IItemKey[], charLayout: CharImageLayout, borderColor: string) {
        this.Name = name;
        this.Copper = copper;
        this.Items = items;
        this.CharLayout = charLayout;
        this.BorderColor = borderColor;
    }

    public GetItemsAsStringArray(): string[] {
        return this.Items.map(item => JSON.stringify(item));
    }

    public static GetStringArrayAsItems(itemJson: string[]): IItemKey[] {
        let items: IItemKey[] = itemJson
            .map(PlayerCharacterData.GetItemsFromJson)
            .filter(item => item !== undefined) as IItemKey[];

        return items;
    }

    private static GetItemsFromJson(value: string): IItemKey | undefined {
        let retVal: IItemKey | undefined = undefined;

        try {
            let parsedResponse = JSON.parse(value);
            if (parsedResponse as IItemKey) {
                retVal = parsedResponse;
            }
        }
        catch {
            // Just ignore this for now. Return undefined.
        }

        return retVal;
    }
}
