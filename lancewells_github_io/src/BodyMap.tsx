export type ImageLayer = {
    key: string;
    images: string[];
}

export type BodyMap = {
    imageSource: string;
    layers: ImageLayer[];
}

export const bodyMaps: BodyMap[] = new Array(0);
bodyMaps.push({
    imageSource: "./images/BodyTypes/Blue.png",
    layers: [{
        key: "Clothing",
        images: [
            "./images/BlueAccessories/BlueTriangle.png"
        ]
    }]
}, {
    imageSource: "./images/BodyTypes/Green.png",
    layers: [{
        key: "Clothing",
        images: [
            "./images/GreenAccessories/GreenTriangle.png"
        ]
    }]
});