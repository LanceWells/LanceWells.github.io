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
    name: 'Masculine, Average-Sized',
    description: "Masculine body type! Of average size; good for humans, elves, and orcs",
    imageSource: "./images/Size_Average/Body/Male/Base_Male_Tan.png",
    layers: [{
        key: "Body Archetype",
        layerIndex: 1,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Body/Male/Base_Male_Bright_Orc.png",
            "./images/Size_Average/Body/Male/Base_Male_Medium_Orc.png",
            "./images/Size_Average/Body/Male/Base_Male_Dorc.png",
            "./images/Size_Average/Body/Male/Base_Male_Drow.png",
            "./images/Size_Average/Body/Male/Base_Male_Pale.png",
            "./images/Size_Average/Body/Male/Base_Male_Fair.png",
            "./images/Size_Average/Body/Male/Base_Male_Light.png",
            "./images/Size_Average/Body/Male/Base_Male_Tan.png",
            "./images/Size_Average/Body/Male/Base_Male_Dark.png",
            "./images/Size_Average/Body/Male/Base_Male_Darker.png",
            "./images/Size_Average/Body/Male/Base_Male_Darkest.png",
        ],
    }, {
        key: "Cloaks",
        layerIndex: 2,
        images: [
            "./images/Empty/Empty.png",
        ]
    }, {
        key: "Bottoms",
        layerIndex: 3,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Bottoms/Male/BluePants.png",
            "./images/Size_Average/Bottoms/Male/BlackPants.png",
        ]
    }, {
        key: "Lower Armor",
        layerIndex: 4,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/LowerArmor/Male/LegBands.png",
        ]
    }, {
        key: "Shoes",
        layerIndex: 5,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Shoes/Male/TallBoots.png",
            "./images/Size_Average/Shoes/Male/PlatedBoots.png",
            "./images/Size_Average/Shoes/Male/BlackSandals.png",
        ]
    }, {
        key: "Tops",
        layerIndex: 6,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Tops/Male/PlainBlackShirt.png",
            "./images/Size_Average/Tops/Male/PlainWhiteShirt.png",
            "./images/Size_Average/Tops/Male/LooseBlackShirt.png",
            "./images/Size_Average/Tops/Male/Chainmail.png",
        ]
    }, {
        key: "Upper Armor",
        layerIndex: 7,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/UpperArmor/Male/LeatherCoat.png",
            "./images/Size_Average/UpperArmor/Male/LeatherVest.png",
            "./images/Size_Average/UpperArmor/Male/ChainmailDecorations.png",
        ]
    }, {
        key: "Mid Accessory",
        layerIndex: 8,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/MidAccessory/Male/PlainBelt.png",
            "./images/Size_Average/MidAccessory/Male/Pouches.png",
        ]
    }, {
        key: "Arm Armor",
        layerIndex: 9,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/ArmArmor/Male/LeatherSleeves.png",
            "./images/Size_Average/ArmArmor/Male/RedShoulderCloak.png",
            "./images/Size_Average/ArmArmor/Male/BlackShoulderCloak.png",
            "./images/Size_Average/ArmArmor/Male/PlateArms.png",
        ]
    }, {
        key: "Hair",
        layerIndex: 11,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Hair/Androgynous/DarkHood.png",
            "./images/Size_Average/Hair/Androgynous/RedHood.png",
            "./images/Size_Average/Hair/Androgynous/GreenHood.png",
            "./images/Size_Average/Hair/Androgynous/RedLong.png",
            "./images/Size_Average/Hair/Androgynous/BlackLong.png",
            "./images/Size_Average/Hair/Androgynous/CurlsBlonde.png",
            "./images/Size_Average/Hair/Androgynous/CurlsRed.png",
            "./images/Size_Average/Hair/Androgynous/ShortBlack.png",
            "./images/Size_Average/Hair/Androgynous/ShortBlonde.png",
            "./images/Size_Average/Hair/Androgynous/ShortBrown.png",
            "./images/Size_Average/Hair/Androgynous/ShortRed.png",
            "./images/Size_Average/Hair/Androgynous/BrownWavy.png",
            "./images/Size_Average/Hair/Androgynous/GreyWavy.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopBlack.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopBlonde.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopBrown.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopRed.png",
            "./images/Size_Average/Hair/Androgynous/BrownClose.png",
            "./images/Size_Average/Hair/Androgynous/RedClose.png",
            "./images/Size_Average/Hair/Androgynous/SlickedBlack.png",
            "./images/Size_Average/Hair/Androgynous/SlickedBlonde.png",
            "./images/Size_Average/Hair/Androgynous/SlickedBrown.png",
            "./images/Size_Average/Hair/Androgynous/SlickedRed.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailBlack.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailBlonde.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailBrown.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailRed.png",
        ]
    }, {
        key: "Headwear",
        layerIndex: 10,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/HeadWear/Androgynous/RedMask.png",
            "./images/Size_Average/HeadWear/Androgynous/SkeletonMask.png",
            "./images/Size_Average/HeadWear/Androgynous/BowBlue.png",
            "./images/Size_Average/HeadWear/Androgynous/BowGreen.png",
            "./images/Size_Average/HeadWear/Androgynous/BowPink.png",
            "./images/Size_Average/HeadWear/Androgynous/BowRed.png",
            "./images/Size_Average/HeadWear/Androgynous/BowYellow.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsBlonde.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsBrown.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsBlack.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsRed.png",
        ]
    }
    ]
}, {
    name: 'Feminine, Average-Sized',
    description: "Feminine body type! Of average size; good for humans, elves, and orcs",
    imageSource: "./images/Size_Average/Body/Female/Base_Female_Tan.png",
    layers: [{
        key: "Body Archetype",
        layerIndex: 1,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Body/Female/Base_Female_Bright_Orc.png",
            "./images/Size_Average/Body/Female/Base_Female_Medium_Orc.png",
            "./images/Size_Average/Body/Female/Base_Female_Dorc.png",
            "./images/Size_Average/Body/Female/Base_Female_Drow.png",
            "./images/Size_Average/Body/Female/Base_Female_Pale.png",
            "./images/Size_Average/Body/Female/Base_Female_Fair.png",
            "./images/Size_Average/Body/Female/Base_Female_Light.png",
            "./images/Size_Average/Body/Female/Base_Female_Tan.png",
            "./images/Size_Average/Body/Female/Base_Female_Dark.png",
            "./images/Size_Average/Body/Female/Base_Female_Darker.png",
            "./images/Size_Average/Body/Female/Base_Female_Darkest.png",
        ],
    }, {
        key: "Cloaks",
        layerIndex: 2,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Cloaks/Female/DarkCloak.png",
            "./images/Size_Average/Cloaks/Female/GreenCloak.png",
            "./images/Size_Average/Cloaks/Female/RedCloak.png",
        ]
    }, {
        key: "Bottoms",
        layerIndex: 3,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Bottoms/Female/BlackSimple.png",
            "./images/Size_Average/Bottoms/Female/Jeans.png",
            "./images/Size_Average/Bottoms/Female/Bellbottoms.png",
            "./images/Size_Average/Bottoms/Female/BluePlainPoofyPants.png",
            "./images/Size_Average/Bottoms/Female/BluePoofyPants.png",
            "./images/Size_Average/Bottoms/Female/GreenPlainPoofyPants.png",
            "./images/Size_Average/Bottoms/Female/GreenPoofyPants.png",
            "./images/Size_Average/Bottoms/Female/GreenShorts.png",
            "./images/Size_Average/Bottoms/Female/GreyCapris.png",
            "./images/Size_Average/Bottoms/Female/GreyPlainPoofyPants.png",
            "./images/Size_Average/Bottoms/Female/GreyPoofyPants.png",
            "./images/Size_Average/Bottoms/Female/RedCapris.png",
            "./images/Size_Average/Bottoms/Female/YellowCapris.png",
            "./images/Size_Average/Bottoms/Female/BlackSkirt.png",
            "./images/Size_Average/Bottoms/Female/GreenSkirt.png",
            "./images/Size_Average/Bottoms/Female/PinkSkirt.png",
            "./images/Size_Average/Bottoms/Female/RedSkirt.png",
        ]
    }, {
        key: "Lower Armor",
        layerIndex: 4,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/LowerArmor/Female/KneePlates.png",
        ]
    }, {
        key: "Shoes",
        layerIndex: 5,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Shoes/Female/BattleBoots.png",
            "./images/Size_Average/Shoes/Female/Boots.png",
            "./images/Size_Average/Shoes/Female/PlainShoes.png",
        ]
    }, {
        key: "Tops",
        layerIndex: 6,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Tops/Female/WhiteSimple.png",
            "./images/Size_Average/Tops/Female/SimpleDark.png",
        ]
    }, {
        key: "Upper Armor",
        layerIndex: 7,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/UpperArmor/Female/LeatherCorset.png",
            "./images/Size_Average/UpperArmor/Female/PurpleScaleMail.png",
        ]
    }, {
        key: "Mid Accessory",
        layerIndex: 8,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/MidAccessory/Female/LargeBelt.png",
            "./images/Size_Average/MidAccessory/Female/LargeBeltWithKnives.png",
        ]
    }, {
        key: "Arm Armor",
        layerIndex: 9,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/ArmArmor/Female/GreenScales.png",
            "./images/Size_Average/ArmArmor/Female/RedScales.png",
            "./images/Size_Average/ArmArmor/Female/PlatedSleeves.png",
        ]
    }, {
        key: "Hair",
        layerIndex: 10,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/Hair/Androgynous/DarkHood.png",
            "./images/Size_Average/Hair/Androgynous/RedHood.png",
            "./images/Size_Average/Hair/Androgynous/GreenHood.png",
            "./images/Size_Average/Hair/Androgynous/RedLong.png",
            "./images/Size_Average/Hair/Androgynous/BlackLong.png",
            "./images/Size_Average/Hair/Androgynous/CurlsBlonde.png",
            "./images/Size_Average/Hair/Androgynous/CurlsRed.png",
            "./images/Size_Average/Hair/Androgynous/ShortBlack.png",
            "./images/Size_Average/Hair/Androgynous/ShortBlonde.png",
            "./images/Size_Average/Hair/Androgynous/ShortBrown.png",
            "./images/Size_Average/Hair/Androgynous/ShortRed.png",
            "./images/Size_Average/Hair/Androgynous/BrownWavy.png",
            "./images/Size_Average/Hair/Androgynous/GreyWavy.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopBlack.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopBlonde.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopBrown.png",
            "./images/Size_Average/Hair/Androgynous/BrickTopRed.png",
            "./images/Size_Average/Hair/Androgynous/BrownClose.png",
            "./images/Size_Average/Hair/Androgynous/RedClose.png",
            "./images/Size_Average/Hair/Androgynous/SlickedBlack.png",
            "./images/Size_Average/Hair/Androgynous/SlickedBlonde.png",
            "./images/Size_Average/Hair/Androgynous/SlickedBrown.png",
            "./images/Size_Average/Hair/Androgynous/SlickedRed.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailBlack.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailBlonde.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailBrown.png",
            "./images/Size_Average/Hair/Androgynous/PonyTailRed.png",
        ]
    }, {
        key: "Headwear",
        layerIndex: 11,
        images: [
            "./images/Empty/Empty.png",
            "./images/Size_Average/HeadWear/Androgynous/RedMask.png",
            "./images/Size_Average/HeadWear/Androgynous/SkeletonMask.png",
            "./images/Size_Average/HeadWear/Androgynous/BowBlue.png",
            "./images/Size_Average/HeadWear/Androgynous/BowGreen.png",
            "./images/Size_Average/HeadWear/Androgynous/BowPink.png",
            "./images/Size_Average/HeadWear/Androgynous/BowRed.png",
            "./images/Size_Average/HeadWear/Androgynous/BowYellow.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsBlonde.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsBrown.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsBlack.png",
            "./images/Size_Average/HeadWear/Androgynous/BangsRed.png",
        ]
    }
    ]
}
);