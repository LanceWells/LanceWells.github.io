import './CharacterCreator.css';
import { bodyMaps, BodyMap, ImageLayer } from './BodyMap';

import React from 'react';

import {BodySelector} from './BodySelector';
import {PartAccordion} from './PartAccordion';
import {CharacterCanvas} from './CharacterCanvas';

import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardColumns from 'react-bootstrap/CardColumns'

/**
 * @description
 * The interface for props passed to this object. This class in particular takes no props; it is effectively
 * the app itself.
 */
interface ICharacterCreatorProps {
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
    partLayers: ImageLayer[]
};

/**
 * The main entry point for this application. Provides all of the buttons and fun stuff needed to create a
 * character image on a canvas element.
 */
class CharacterCreator extends React.Component<ICharacterCreatorProps, ICharacterCreatorState> {
    constructor(props: ICharacterCreatorProps) {
        super(props);
        this.state = {
            // Just fill the canvas images with nothing. We'll re-define it when we add to it.
            canvasImages: new Array<string>(),
            partLayers: Array(0)
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

        // Javascript doesn't have arrays of fixed length, so this is safe? Still getting used to this.
        newImagesToRender[0] = bodyMap.imageSource;

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
                <BodySelector
                    onClick={(body: BodyMap) => this.handleBodySelection(body)}
                    bodyMap={bodyMap}
                />
            );
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
                <Container>
                    <Row className="align-items-center">
                        <Col lg={true} className='TopSplit'>
                            <CharacterCanvas
                                imagesToRender={canvasImagesToRender}
                                onClickDownload={(canvas: HTMLCanvasElement) => this.downloadImage(canvas)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={true} className='BottomSplit'>
                            <h2>Accessory Selection</h2>
                            <p className="italics">(You need to select a body first if this is empty)</p>
                            <Accordion>
                                <PartAccordion
                                    layers={currentBodyMap}
                                    onClick={(layerName: number, imageSource: string) => this.handlePartSelection(layerName, imageSource)}
                                />
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={true} className='BottomSplit'>
                            <h2>Body Selection</h2>
                            <p className="italics">(Each body type uses different accessories and will reset your character design)</p>
                            <CardColumns>
                                {this.renderBodySelection()}
                            </CardColumns>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CharacterCreator;
