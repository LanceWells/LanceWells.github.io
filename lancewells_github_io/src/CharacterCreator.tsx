import './CharacterCreator.css'
import React from 'react';

import BodySelector from './BodySelector';
import Canvas from './Canvas';

import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface ICharacterCreatorProps {
};

interface ICharacterCreatorState {
    canvasImages: string[]
};

/**
 * The main entry point for this application. Provides all of the buttons and fun stuff needed to create a
 * character image on a canvas element.
 */
class CharacterCreator extends React.Component<ICharacterCreatorProps, ICharacterCreatorState> {
    constructor(props: ICharacterCreatorProps)
    {
        super(props);
        this.state = {
            // Just fill the canvas images with nothing. We'll re-define it when we add to it.
            canvasImages: Array(0)
        }
    }

    /**
     * Handles the prop-pass from the body-type selector.
     * @param bodyType The type of body that this character creator should acknowledge.
     */
    handleBodySelection(bodyType: string)
    {
        // alert(bodyType);
        // this.state.canvasImages.length;

        // // Keeping this stuff since I'll need it for additional image layering. Body selection needs a clean
        // // slate though, so this doesn't belong here.
        // const arraySize = this.state.canvasImages.length;
        // const newImagesToRender = this.state.canvasImages.slice();
        
        // newImagesToRender[arraySize + 1] = bodyType;
        
        const newImagesToRender: string[] = Array(0);

        // Javascript doesn't have arrays of fixed length, so this is safe? Still getting used to this.
        newImagesToRender[0] = bodyType;
        this.setState({
            canvasImages: newImagesToRender
        });
    }

    /**
     * Renders this object.
     */
    render() {
        const canvasImagesToRender = this.state.canvasImages;

        return (
            <div className="CharacterCreator">
                <Container fluid={true}>
                    <Row>
                        <Col xs lg="4" className='LeftSplit'>
                            <h1>HELLO!</h1>
                            <Canvas imagesToRender={canvasImagesToRender}/>
                        </Col>
                        <Col className='RightSplit'>
                            <h1>HELLLOOOOO</h1>
                            <BodySelector
                                src='./images/BodyTypes/Blue.png'
                                onClick={(bodyType: string) => this.handleBodySelection(bodyType)}
                            />
                            <BodySelector
                                src='./images/BodyTypes/Purple.png'
                                onClick={(bodyType: string) => this.handleBodySelection(bodyType)}
                            />
                            <Accordion defaultActiveKey="1">
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="0"
                                        style={{ cursor: "pointer" }}>
                                        Click!
                                </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>The body of the card! THE HEAAART OF THE CARDS.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CharacterCreator;
