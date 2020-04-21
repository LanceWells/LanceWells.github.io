import CharImageMap from './CharImageStruct.json';
import { CharacterSize } from '../Enums/CharacterSize';
import { BodyType } from '../Enums/BodyType';
import { PartType } from '../Enums/PartType';
import { CharImageStructItem } from '../Types/CharImageStructItem';

export class CharacterImageMap
{
    public static GetCharacterImagePaths(charSize: CharacterSize, validBodyTypes: BodyType[], partType: PartType): string[]
    {
        // let charStructItems: CharImageStructItem[] = CharImageMap.map(i => i);
        let charStructItems: CharImageStructItem[] =  CharImageMap.filter(c =>
            CharacterImageMap.CompareParamsToStructItem(c, charSize, validBodyTypes, partType));

        let charImages: string[] = charStructItems.flatMap(csi => csi.Images);

        return charImages;
    }
    
    private static CompareParamsToStructItem(structItem: CharImageStructItem, charSize: CharacterSize, validBodyTypes: BodyType[], partType: PartType): boolean {
        let doesMatch: boolean = true;

        doesMatch = doesMatch && structItem.PartType === partType.toString();
        doesMatch = doesMatch && structItem.Size === charSize.toString();
        doesMatch = doesMatch && validBodyTypes.some(vbt => vbt.toString() === structItem.BodyType)

        return doesMatch;
    }
}
