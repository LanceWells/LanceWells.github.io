import './css/LandingSpace.css';

import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {LoginPage} from './Login/React/LoginPage';
import { GamePage } from './GamePage/React/GamePage';
import { ProtectedRoute } from './Login/React/ProtectedRoute';
// import CharacterCreator from './CharacterCreator/React/CharacterCreator';
import { CharacterImage } from './CharacterImage/React/CharacterImage';
import { Nav } from 'react-bootstrap';

// Use the hash router instead of a browser router so that refreshes and direct-links to pages work.
//https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
export default function LandingSpace() {
    return (
        <div className="page-nav">
        <Nav defaultActiveKey="/" className="flex-column">
            <Nav.Link href="/#/" eventKey="/">Home</Nav.Link>
            <Nav.Link href="/#/character_creator" eventKey="character_creator">Character Creator</Nav.Link>
            <Nav.Link href="/#/login" eventKey="login">Login</Nav.Link>
        </Nav>
            <Router>
                <Switch>
                    <Route exact path="/login" children={<LoginPage />} />
                    <Route exact path="/character_creator" children={<CharacterImage/>} />
                    <ProtectedRoute path="/" children={<GamePage />} />
                </Switch>
            </Router>
        </div>
    )
}
