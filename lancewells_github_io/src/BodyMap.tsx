/**
 * @description
 * The contents of each image "layer" that can be overlayed on top of the character image. This contains info
 * about what the layer is called (e.g. 'clothing', or 'hats'), what the z-layer info is for the layer, and a
 * list of possible image sources that are contained in the image layer.
 * @param key The name of the layer.
 * @param layerIndex The z-index of the layer. The higher the number, the more 'in front' that the layer is.
 * @param images A list of possible image sources that are drawn in this layer. Only one of these can be drawn
 * from this list at a time (this is intentional).
 */
export type ImageLayer = {
    key: string;
    layerIndex: number;
    images: string[];
}

/**
 * @description
 * A mapping from the body that will be displayed to the list of layers associated with that body.
 */
export type BodyMap = {
    name: string;
    description: string;
    imageSource: string;
    layers: ImageLayer[];
}

/**
 * @remarks The layer index for every layer starts at 1. This is because '0' is reserved for the base
 * body. Setting this to '0' on a layer will remove the base body.
 * @todo Make this import from a json file instead.
 */
export const bodyMaps: BodyMap[] = new Array(0);
bodyMaps.push({
    name: 'Average-Sized Male',
    description: "Men of average height! Useful for human characters and elves.",
    imageSource: "./images/Size_Average/Base_Male_Light.png",
    layers: [{
        key: "Body Archetype",
        layerIndex: 1,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Base_Male_Drow.png",
            "./images/Size_Average/Base_Male_Pale.png",
            "./images/Size_Average/Base_Male_Fair.png",
            "./images/Size_Average/Base_Male_Light.png",
            "./images/Size_Average/Base_Male_Tan.png",
            "./images/Size_Average/Base_Male_Dark.png",
            "./images/Size_Average/Base_Male_Darker.png",
            "./images/Size_Average/Base_Male_Darkest.png",
        ],
    },
    {
        key: "Sparkles",
        layerIndex: 2,
        images: [
            "./images/Empty/Empty.png",
            "./images/Sparkles/YellowSparkles.png",
        ]
    }]
}, {
    name: 'Average-Sized Female',
    description: "Women of average height! Useful for human characters and elves.",
    imageSource: "./images/Size_Average/Base_Female_Light.png",
    layers: [{
        key: "Body Archetype",
        layerIndex: 1,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Base_Female_Drow.png",
            "./images/Size_Average/Base_Female_Pale.png",
            "./images/Size_Average/Base_Female_Fair.png",
            "./images/Size_Average/Base_Female_Light.png",
            "./images/Size_Average/Base_Female_Tan.png",
            "./images/Size_Average/Base_Female_Dark.png",
            "./images/Size_Average/Base_Female_Darker.png",
            "./images/Size_Average/Base_Female_Darkest.png",
        ],
    }, {
        key: "Cloaks",
        layerIndex: 2,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/Cloaks/DarkCloak.png",
        ]
    }, {
        key: "Leggings",
        layerIndex: 3,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/Leggings/BlackSimple.png",
        ]
    }, {
        key: "Lower Armor",
        layerIndex: 4,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/LowerArmor/KneePlates.png",
        ]
    }, {
        key: "Shoes",
        layerIndex: 5,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/Shoes/BattleBoots.png",
            "./images/Size_Average/FemaleClothing/Shoes/Boots.png",
            "./images/Size_Average/FemaleClothing/Shoes/PlainShoes.png",
        ]
    }, {
        key: "Shirts",
        layerIndex: 6,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/Shirts/WhiteSimple.png",
            "./images/Size_Average/FemaleClothing/Shirts/SimpleDark.png",
        ]
    }, {
        key: "Upper Armor",
        layerIndex: 7,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/UpperArmor/LeatherCorset.png",
            "./images/Size_Average/FemaleClothing/UpperArmor/PurpleScaleMail.png",
        ]
    }, {
        key: "Mid Accessory",
        layerIndex: 8,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/MidAccessory/LargeBelt.png",
            "./images/Size_Average/FemaleClothing/MidAccessory/LargeBeltWithKnives.png",
        ]
    }, {
        key: "Arm Armor",
        layerIndex: 9,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/ArmArmor/GreenScales.png",
            "./images/Size_Average/FemaleClothing/ArmArmor/RedScales.png",
            "./images/Size_Average/FemaleClothing/ArmArmor/PlatedSleeves.png",
        ]
    }, {
        key: "Hair",
        layerIndex: 10,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/FemaleClothing/Hair/RedLong.png",
            "./images/Size_Average/FemaleClothing/Hair/BlackLong.png",
            "./images/Size_Average/FemaleClothing/Hair/DarkHood.png",
        ]
    }, {
        key: "Hats",
        layerIndex: 11,
        images: [
            "./images/Empty/Empty.png",
        ]
    }
    ]
}

);