import avgFeminineLayers from './json/avgFeminine.json';
import avgMasculineLayers from './json/avgMasculine.json';

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
 */
export var bodyMaps: BodyMap[] = new Array(0);
bodyMaps.push({
    name: 'Masculine, Average-Sized',
    description: "Masculine body type! Of average size; good for humans, elves, and orcs",
    imageSource: "./images/Size_Average/0-Body/Male/Base_Male_Tan.png",
    layers: avgMasculineLayers
}, {
    name: 'Feminine, Average-Sized',
    description: "Feminine body type! Of average size; good for humans, elves, and orcs",
    imageSource: "./images/Size_Average/0-Body/Female/Base_Female_Tan.png",
    layers: avgFeminineLayers
}
);
