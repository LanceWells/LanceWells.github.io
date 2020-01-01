import './CharacterCreator.css';
import { bodyMaps, BodyMap, ImageLayer } from './BodyMap';

import React from 'react';

import {BodySelector} from './BodySelector';
import {PartAccordion} from './PartAccordion';
import {CharacterCanvas} from './CharacterCanvas';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Carousel } from 'react-bootstrap';

/**
 * @description
 * The interface for props passed to this object. This class in particular takes no props; it is effectively
 * the app itself.
 */
export interface ICharacterCreatorProps {
};

/**
 * @description
 * The interface for the internal state maintained by this object.
 * @param canvasImages The list of image sources, represented as strings, that will be rendered using the
 * Canvas class.
 * @param partLayers A list of image layers. This contains information about all of the possible layers that
 * can be drawn to the currently-selected body type. This contains information about what each layer is, how
 * that layer is drawn, and what the possible images are in that layer.
 */
interface ICharacterCreatorState {
    canvasImages: Array<string>,
    partLayers: ImageLayer[],
    carouselIndex: any,
    carouselDirection: "prev" | "next"
};

/**
 * The main entry point for this application. Provides all of the buttons and fun stuff needed to create a
 * character image on a canvas element.
 */
export class CharacterCreator extends React.Component<ICharacterCreatorProps, ICharacterCreatorState> {
    constructor(props: ICharacterCreatorProps) {
        super(props);
        this.state = {
            // Just fill the canvas images with nothing. We'll re-define it when we add to it.
            canvasImages: new Array<string>(),
            partLayers: Array(0),
            carouselIndex: 0,
            carouselDirection: "next"
        }
    }

    /**
     * @description
     * Used to download the main character image from the canvas. This is a callback that is passed down to
     * the canvas element.
     * @param canvas The canvas html element from the Canvas character creator class.
     */
    downloadImage(canvas: HTMLCanvasElement)
    {
        const downloadUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        link.download = 'characterImage.png';
        link.href = downloadUrl;
        link.click();
    }

    /**
     * A handler for a part selector. Replaces the image at the specified index with a new image.
     * @param layerIndex The index of the layer. This is the z-layer, effectively. The higher the number, the
     * more layers that it draws over.
     * @param imageSource The image source. This is what gets drawn.
     */
    handlePartSelection(layerIndex: number, imageSource: string) {
        const newCanvasImages: Array<string> = this.state.canvasImages;

        // Javascript doesn't have arrays of fixed length, so this is safe? Still getting used to this.
        newCanvasImages[layerIndex] = imageSource;

        this.setState({
            canvasImages: newCanvasImages
        })
    }

    /**
     * Handles the prop-pass from the body-type selector.
     * @param bodyType The type of body that this character creator should acknowledge.
     */
    handleBodySelection(bodyMap: BodyMap) {
        const newImagesToRender: Array<string> = new Array<string>(0);

        bodyMap.layers.forEach(layer => {
            layer.images.forEach(image => {
                if (image.imageSource.includes('default.png'))
                {
                    newImagesToRender[layer.layerIndex] = image.imageSource;
                }
                // image.tags.forEach(tag => {
                //     if (tag === 'default') {
                //         // Javascript doesn't have arrays of fixed length, so this is safe? Still getting used
                //         // to this.
                //         newImagesToRender[layer.layerIndex] = image.imageSource;
                //     }
                // });
            });
        });

        this.setState({
            canvasImages: newImagesToRender,
            partLayers: bodyMap.layers
        });
    }

    /**
     * @description
     * Renders a series of body selectors for the user to pick from. These body selectors will modify the list
     * of available accessories (since a tiny hat looks silly on a giant person . . . or does it?). Needs to
     * look at the BodyMap.tsx file to understand what will be populated.
     */
    renderBodySelection() {
        return bodyMaps.map((bodyMap) => {
            return (
                <Carousel.Item>
                    <BodySelector
                        onClick={(body: BodyMap) => this.handleBodySelection(body)}
                        bodyMap={bodyMap}
                    />
                </Carousel.Item>
            );
        });
    }

    /**
     * @description
     * Handles a carousel selection event. Is used to ensure that the carousel cycles left when the left
     * button is pressed; and the same for the right button.
     * @param eventKey The event key. This is the index that the carousel is being cycled to.
     * @param direction The direction that the carousel is being cycled in.
     */
    handleCarouselSelect(eventKey: any, direction: "prev" | "next") {
        this.setState({
            carouselIndex: eventKey,
            carouselDirection: direction
        });
    }

    /**
     * Renders this object.
     */
    render() {
        const canvasImagesToRender = this.state.canvasImages;
        const currentBodyMap = this.state.partLayers;

        return (
            <div className="CharacterCreator">
                <h1>Character Creator</h1>
                <Container fluid={true}>
                    <Row>
                        <Col lg={1} />
                        <Col lg={4}>
                            <div className='body-creation'>
                                <div className='body-selector'>
                                    <h2>Body Selection</h2>
                                    <p className="italics">(Each body type uses different accessories and will reset your character design)</p>
                                    <Carousel
                                        interval={null}
                                        indicators={false}
                                        onSelect={this.handleCarouselSelect.bind(this)}>
                                        {this.renderBodySelection()}
                                    </Carousel>
                                    </div>
                                    <div className='body-canvas'>
                                        <CharacterCanvas
                                            imagesToRender={canvasImagesToRender}
                                            onClickDownload={(canvas: HTMLCanvasElement) => this.downloadImage(canvas)}
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className='acc-selector'>
                                <h2>Accessory Selection</h2>
                                <p className="italics">(You need to select a body first if this is empty)</p>
                                <PartAccordion
                                    layers={currentBodyMap}
                                    onClick={(layerName: number, imageSource: string) => this.handlePartSelection(layerName, imageSource)}
                                />
                            </div>
                        </Col>
                        <Col lg={1} />
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CharacterCreator;
