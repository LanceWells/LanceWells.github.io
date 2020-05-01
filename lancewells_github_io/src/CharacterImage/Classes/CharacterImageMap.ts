import CharImageMap from './CharImageStruct.json';
import { CharacterSize } from '../Enums/CharacterSize';
import { BodyType } from '../Enums/BodyType';
import { PartType } from '../Enums/PartType';
import { CharImageStructItem } from '../Types/CharImageStructItem';
import { BodyDescription } from '../Enums/BodyDescription';
import { CharImageLayout } from './CharImageLayout';

/**
 * @description A singleton-like class used to reference constants in the character parts, body types, etc.
 */
export class CharacterImageMap
{
    /**
     * @description The default images to display when a user selects the "Average-Sized Feminine" body type.
     */
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

    /**
     * @description The default images to display when a user selects the "Average-Sized Masculine" body type.
     */
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
    
    /**
     * @description The default images to display when a user selects the "Reptilian Feminine" body type.
     */
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

    /**
     * @description The default images to display when a user selects the "Reptilian Masculine" body type.
     */
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

    /**
     * @description A map of body types to their respective valid part-type categories. For example, the
     * "average-sized feminine" body type can use parts from the, "humanoid female", "humanoid androgynous",
     * "female", and "androgynous" categories.
     */
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

    /**
     * @description The image source for the shadow for the character.
     */
    public static CharacterShadowSource: string = "./images/Character_Image_Details/CharacterShadow.png"

    /**
     * @description Gets the list of valid character images for a given series of body type categories.
     * @param charSize The size of the character to get images for.
     * @param bodyType The type of body to get the images for.
     * @param partType The part type to get images for.
     */
    public static GetCharacterImagePaths(charSize: CharacterSize, bodyType: BodyType, partType: PartType): string[]
    {
        let charStructItems: CharImageStructItem[] =  CharImageMap.filter(c =>
            CharacterImageMap.CompareParamsToStructItem(c, charSize, bodyType, partType));

        let charImages: string[] = charStructItems.flatMap(csi => csi.Images);

        return charImages;
    }

    /**
     * @description A map of body types to their respective default images. Note that this is merely a wrapper
     * to an internal list, this is just to reduce visual noise.
     */
    public static DefaultBodyParts: Map<BodyType, CharImageLayout> = new Map<BodyType, CharImageLayout>(
        [
            [
                BodyType.AverageSizedFeminine,
                new CharImageLayout(CharacterImageMap.AverageSizedFeminineDefaults, BodyType.AverageSizedFeminine)
            ],
            [
                BodyType.AverageSizedMasculine,
                new CharImageLayout(CharacterImageMap.AverageSizedMasculineDefaults, BodyType.AverageSizedMasculine)
            ],
            [
                BodyType.ReptilianFeminine,
                new CharImageLayout(CharacterImageMap.ReptilianFeminineDefaults, BodyType.ReptilianFeminine)
            ],
            [
                BodyType.ReptilianMasculine,
                new CharImageLayout(CharacterImageMap.ReptilianMasculineDefaults, BodyType.ReptilianMasculine)
            ],
        ]
    );

    /**
     * @description Compares the body-type selection options to the character map struct, picking out items
     * that have a valid match.
     * @param structItem The struct item part to evaluate.
     * @param charSize The size of the character to get images for.
     * @param bodyType The type of body to get the images for.
     * @param partType The part type to get images for.
     */
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
