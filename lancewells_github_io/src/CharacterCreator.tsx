import './CharacterCreator.css';
import { bodyMaps, BodyMap, ImageLayer } from './BodyMap';
// const bodyMaps = require('BodyMap');
// import bodySelectionJson from './json/bodyMap_00.json';

import React from 'react';

// import ImageLayer from './BodyMap';
import BodySelector from './BodySelector';
import Canvas from './Canvas';

import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {PartAccordion} from './PartAccordion';
import { string } from 'prop-types';

interface ICharacterCreatorProps {
};

interface ICharacterCreatorState {
    canvasImages: Map<string, string>,
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
            canvasImages: new Map<string, string>(),
            partLayers: Array(0)
        }
    }

    handlePartSelection(layer: string, imageSource: string) {
        // alert(layer + 'becomes: ' + imageSource);
        const newCanvasImages: Map<string, string> = new Map<string, string>(this.state.canvasImages);
        newCanvasImages.set(layer, imageSource);

        this.setState({
            canvasImages: newCanvasImages
        })
    }

    /**
     * Handles the prop-pass from the body-type selector.
     * @param bodyType The type of body that this character creator should acknowledge.
     */
    handleBodySelection(bodyMap: BodyMap) {
        // alert(bodyType);
        // this.state.canvasImages.length;

        // // Keeping this stuff since I'll need it for additional image layering. Body selection needs a clean
        // // slate though, so this doesn't belong here.
        // const arraySize = this.state.canvasImages.length;
        // const newImagesToRender = this.state.canvasImages.slice();

        // newImagesToRender[arraySize + 1] = bodyType;

        const newImagesToRender: Map<string, string> = new Map<string, string>();

        // Javascript doesn't have arrays of fixed length, so this is safe? Still getting used to this.
        newImagesToRender.set('body', bodyMap.imageSource);

        this.setState({
            canvasImages: newImagesToRender,
            partLayers: bodyMap.layers
        });

        // alert(layers.toString());
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
                <Container fluid={true}>
                    <Row>
                        <Col xs lg="4" className='LeftSplit'>
                            <h1>HELLO!</h1>
                            <Canvas imagesToRender={canvasImagesToRender} />
                        </Col>
                        <Col className='RightSplit'>
                            <h1>HELLLOOOOO</h1>
                            <ButtonGroup>
                                {this.renderBodySelection()}
                            </ButtonGroup>
                            <Accordion defaultActiveKey="1">
                                <PartAccordion
                                    layers={currentBodyMap}
                                    onClick={(layerName: string, imageSource: string) => this.handlePartSelection(layerName, imageSource)}
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
