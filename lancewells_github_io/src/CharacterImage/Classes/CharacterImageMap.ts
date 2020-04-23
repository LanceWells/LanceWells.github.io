import CharImageMap from './CharImageStruct.json';
import { CharacterSize } from '../Enums/CharacterSize';
import { BodyType } from '../Enums/BodyType';
import { PartType } from '../Enums/PartType';
import { CharImageStructItem } from '../Types/CharImageStructItem';
import { BodyDescription } from '../Enums/BodyDescription';

export class CharacterImageMap
{
    public static GetCharacterImagePaths(charSize: CharacterSize, bodyType: BodyType, partType: PartType): string[]
    {
        let charStructItems: CharImageStructItem[] =  CharImageMap.filter(c =>
            CharacterImageMap.CompareParamsToStructItem(c, charSize, bodyType, partType));

        let charImages: string[] = charStructItems.flatMap(csi => csi.Images);

        return charImages;
    }

    public static PartOrder: PartType[] = [
        PartType.BackAccessory,
        PartType.Body,
        PartType.Bottoms,
        PartType.Shoes,
        PartType.LowerArmor,
        PartType.Tops,
        PartType.UpperArmor,
        PartType.MidAccessory,
        PartType.ArmArmor,
        PartType.HandWear,
        PartType.Hair,
        PartType.FacialWear,
        PartType.HeadWear,
        PartType.Pets,
        PartType.Weapons,
        PartType.Eyes
    ];

    private static BodyTypeMap: Map<BodyType, BodyDescription[]> = new Map<BodyType, BodyDescription[]>(
        [
            [
                BodyType.AverageSizedFeminine,
                [
                    BodyDescription.HumanoidFemale,
                    BodyDescription.HumanoidAndrogynous,
                    BodyDescription.Female,
                    BodyDescription.Androgynous,
                ]
            ],
            [
                BodyType.AverageSizedMasculine,
                [
                    BodyDescription.HumanoidMale,
                    BodyDescription.HumanoidAndrogynous,
                    BodyDescription.Male,
                    BodyDescription.Androgynous,
                ]
            ],
            [
                BodyType.ReptilianFeminine,
                [
                    BodyDescription.ReptilianFemale,
                    BodyDescription.ReptilianAndrogynous,
                    BodyDescription.Female,
                    BodyDescription.Androgynous,
                ]
            ],
            [
                BodyType.ReptilianMasculine,
                [
                    BodyDescription.ReptilianMale,
                    BodyDescription.ReptilianAndrogynous,
                    BodyDescription.Male,
                    BodyDescription.Androgynous,
                ]
            ],
        ]
    );

    private static CompareParamsToStructItem(structItem: CharImageStructItem, charSize: CharacterSize, bodyType: BodyType, partType: PartType): boolean {
        let doesMatch: boolean = true;
        let validBodyDescriptors: BodyDescription[] = [];

        if (this.BodyTypeMap.has(bodyType)) {
            validBodyDescriptors = this.BodyTypeMap.get(bodyType) as BodyDescription[];
        }
        else {
            console.error(`Invalid body type: ${bodyType} attempted to be retrieved in character image map.`);
        }
        
        doesMatch = doesMatch && structItem.PartType === partType.toString();
        doesMatch = doesMatch && structItem.Size === charSize.toString();
        doesMatch = doesMatch && validBodyDescriptors.some(vbt => vbt.toString() === structItem.BodyType)

        return doesMatch;
    }
}
