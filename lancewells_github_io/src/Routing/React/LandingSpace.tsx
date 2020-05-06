import '../LandingSpace.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { LoginPage } from '../../LoginPage/React/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { CharacterImage } from '../../CharacterImage/React/CharacterImage';
import { Navbar, Nav } from 'react-bootstrap';
import { Inventory } from '../../Inventory/React/Inventory';
import { CharacterManager } from '../../CharacterManager/React/CharacterManager';
import { CharacterInfoContainer } from '../../Inventory/React/CharacterInfoContainer';

// Use the hash router instead of a browser router so that refreshes and direct-links to pages work.
//https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
export default function LandingSpace() {
    return (
        <div className="landing-space">
            <div className="page-nav">
                <Navbar expand="lg" bg="dark">
                    <Navbar.Brand style={{ color: "white" }} href="/">LantsPants.com</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-pagebar-nav" />
                    <Navbar.Collapse>
                        <Nav defaultActiveKey="/">
                            <Nav.Link
                                href="/#/character_creator"
                                eventKey="character_creator"
                                style={{ color: "white" }}>
                                Character Creator
                            </Nav.Link>
                            <Nav.Link
                                href="/#/inventory"
                                eventKey="inventory"
                                style={{ color: "white" }}>
                                Inventory
                            </Nav.Link>
                            <Nav.Link
                                href="/#/characterManager"
                                eventKey="characterManager"
                                style={{ color: "white" }}>
                                Characters
                            </Nav.Link>
                        </Nav>
                        <CharacterInfoContainer />
                    </Navbar.Collapse>
                </Navbar>
            </div>
            <div className="page-content">
                <Router>
                    <Switch>
                        <Route exact path="/" children={<LoginPage />} />
                        <Route exact path="/login" children={<LoginPage />} />
                        <Route exact path="/character_creator" children={<CharacterImage />} />
                        <ProtectedRoute path="/inventory" children={<Inventory />} />
                        <ProtectedRoute path="/characterManager" children={<CharacterManager />} />
                    </Switch>
                </Router>
            </div>
        </div>
    )
}
