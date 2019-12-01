import './CharacterCreator.css';
import { bodyMaps, BodyMap, ImageLayer } from './BodyMap';

import React from 'react';

import BodySelector from './BodySelector';
import Canvas from './Canvas';

import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {PartAccordion} from './PartAccordion';

interface ICharacterCreatorProps {
};

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

    handlePartSelection(layerIndex: number, imageSource: string) {
        const newCanvasImages: Array<string> = this.state.canvasImages.slice();
        newCanvasImages[layerIndex] =  imageSource;

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
     * Renders a series of body selectors for the user to pick from. These body selectors will modify the list
     * of available accessories (since a tiny hat looks silly on a giant person . . . or does it?). Needs to
     * look at a json file (json/bodySelection.json) to understand what to populate.
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
                            <Canvas imagesToRender={canvasImagesToRender} />
                            <p className="italics">(Right-click and select 'Save Image As' to save)</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={true} className='BottomSplit'>
                            <h2>Body Selection</h2>
                            <p className="italics">(Each body type uses different accessories and will reset your character design)</p>
                            <ButtonGroup>
                                {this.renderBodySelection()}
                            </ButtonGroup>
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
                </Container>
            </div>
        );
    }
}

export default CharacterCreator;
