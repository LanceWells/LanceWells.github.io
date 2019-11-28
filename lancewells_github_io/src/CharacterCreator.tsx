import './CharacterCreator.css'
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import BodySelector from './BodySelector';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface ICharacterCreator {
    currentBodySelection: string;
}

/**
 * The main entry point for this application. Provides all of the buttons and fun stuff needed to create a
 * character image on a canvas element.
 */
class CharacterCreator extends React.Component {
    /**
     * Creates a new instance of the character creator.
     * @param props A set of properties to pass to this component. Should use the interface,
     * ICharacterCreator.
     */
    constructor(props: ICharacterCreator) {
        super(props);
        this.state = {
            currentBodySelection: null
        }
    }

    /**
     * Handles the prop-pass from the body-type selector.
     * @param bodyType The type of body that this character creator should acknowledge.
     */
    handleBodySelection(bodyType: string)
    {
        alert(bodyType);
    }

    /**
     * Renders this object.
     */
    render() {
        return (
            <div className="CharacterCreator">
                <Container fluid={true}>
                    <Row>
                        <Col xs lg="4" className='LeftSplit'>
                            <h1>HELLO!</h1>
                        </Col>
                        <Col className='RightSplit'>
                            <h1>HELLLOOOOO</h1>
                            <BodySelector
                                src='./images/BodyTypes/Blue.png'
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
