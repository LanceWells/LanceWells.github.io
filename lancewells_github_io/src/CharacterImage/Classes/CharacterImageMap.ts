import CharImageMap from './CharImageStruct.json';
import { CharacterSize } from '../Enums/CharacterSize';
import { BodyType } from '../Enums/BodyType';
import { PartType } from '../Enums/PartType';
import { CharImageStructItem } from '../Types/CharImageStructItem';
import { BodyDescription } from '../Enums/BodyDescription';
import { CharImageLayout } from './CharImageLayout';

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

    private static AverageSizedFeminineDefaults: Map<PartType, string> = new Map<PartType, string>([
        [
            PartType.Eyes,
            "./images/Character_Image_Defaults/Average-Sized Feminine/Eyes.png"
        ],
        [
            PartType.Body,
            "./images/Character_Image_Defaults/Average-Sized Feminine/Body.png"
        ]
    ]);

    private static AverageSizedMasculineDefaults: Map<PartType, string> = new Map<PartType, string>([
        [
            PartType.Eyes,
            "./images/Character_Image_Defaults/Average-Sized Masculine/Eyes.png"
        ],
        [
            PartType.Body,
            "./images/Character_Image_Defaults/Average-Sized Masculine/Body.png"
        ]
    ]);

    private static ReptilianFeminineDefaults: Map<PartType, string> = new Map<PartType, string>([
        [
            PartType.Eyes,
            "./images/Character_Image_Defaults/Reptilian Feminine/Eyes.png"
        ],
        [
            PartType.Body,
            "./images/Character_Image_Defaults/Reptilian Feminine/Body.png"
        ]
    ]);

    private static ReptilianMasculineDefaults: Map<PartType, string> = new Map<PartType, string>([
        [
            PartType.Eyes,
            "./images/Character_Image_Defaults/Reptilian Masculine/Eyes.png"
        ],
        [
            PartType.Body,
            "./images/Character_Image_Defaults/Reptilian Masculine/Body.png"
        ]
    ]);

    public static DefaultBodyParts: Map<BodyType, CharImageLayout> = new Map<BodyType, CharImageLayout>(
        [
            [
                BodyType.AverageSizedFeminine,
                new CharImageLayout(CharacterImageMap.AverageSizedFeminineDefaults)
            ],
            [
                BodyType.AverageSizedMasculine,
                new CharImageLayout(CharacterImageMap.AverageSizedMasculineDefaults)
            ],
            [
                BodyType.ReptilianFeminine,
                new CharImageLayout(CharacterImageMap.ReptilianFeminineDefaults)
            ],
            [
                BodyType.ReptilianMasculine,
                new CharImageLayout(CharacterImageMap.ReptilianMasculineDefaults)
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
