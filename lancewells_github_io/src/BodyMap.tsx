export type ImageLayer = {
    key: string;
    layerIndex: number;
    images: string[];
}

export type BodyMap = {
    imageSource: string;
    layers: ImageLayer[];
}

/**
 * @remarks The layer index for every layer starts at 1. This is because '0' is reserved for the base
 * body. Setting this to '0' on a layer will remove the base body.
 */
export const bodyMaps: BodyMap[] = new Array(0);
bodyMaps.push({
    imageSource: "./images/BodyTypes/Blue.png",
    layers: [{
        key: "Clothing",
        layerIndex: 1,
        images: [
            "./images/Empty/Empty.png",
            "./images/BlueAccessories/BlueTriangle.png"
        ]
    }]
}, {
    imageSource: "./images/BodyTypes/Green.png",
    layers: [{
        key: "Clothing",
        layerIndex: 1,
        images: [
            "./images/Empty/Empty.png",
            "./images/GreenAccessories/GreenTriangle.png"
        ],
    },
    {
        key: "Sparkles",
        layerIndex: 2,
        images: [
            "./images/Sparkles/YellowSparkles.png"
        ]
    }]
});