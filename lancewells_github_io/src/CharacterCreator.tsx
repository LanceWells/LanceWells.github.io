import './CharacterCreator.css'
import React from 'react';

// https://www.npmjs.com/package/react-split-pane
import SplitPane from 'react-split-pane';
import 'bootstrap/dist/css/bootstrap.min.css';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import BodySelector from './BodySelector';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CharacterCreator extends React.Component {
    render() {
        return (
            <div className="CharacterCreator">
                <Container fluid={true}>
                    <Row>
                        <Col xs lg="4">
                            <h1>HELLO!</h1>
                        </Col>
                        <Col>
                            <h1>HELLLOOOOO</h1>
                            <BodySelector
                                src='./images/BodyTypes/Blue'
                                onClick={() => alert('af')}
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

// <div className="CharacterCreator">
//     <SplitPane split="vertical" allowResize={false} defaultSize={500}>
//         <div className="LeftSplit">
//             <h1>HELLO!</h1>
//         </div>
//         <div className="RightSplit">
//             <h1>HELLLOOOOO</h1>
//             <BodySelector
//                 src='./images/BodyTypes/Blue'
//                 onClick={() => alert('af')}
//             />
//             <Accordion defaultActiveKey="1">
//                 <Card>
//                     <Accordion.Toggle as={Card.Header} eventKey="0"
//                         style={{ cursor: "pointer" }}>
//                         Click!
//                                 </Accordion.Toggle>
//                     <Accordion.Collapse eventKey="0">
//                         <Card.Body>The body of the card! THE HEAAART OF THE CARDS.</Card.Body>
//                     </Accordion.Collapse>
//                 </Card>
//             </Accordion>
//         </div>
//     </SplitPane>
// </div>

export default CharacterCreator;
