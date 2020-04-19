import { ImageDescriptor } from "./ImageDescriptor";

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
    images: ImageDescriptor[];
}
