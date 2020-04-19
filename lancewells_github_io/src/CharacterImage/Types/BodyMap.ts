import { ImageLayer } from './ImageLayer';

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
