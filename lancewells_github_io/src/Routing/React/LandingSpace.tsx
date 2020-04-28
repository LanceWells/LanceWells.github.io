import 'bootstrap/dist/css/bootstrap.min.css';
import '../LandingSpace.css';

import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { LoginPage } from '../../LoginPage/React/LoginPage';
// import { GamePage } from '../../GamePage/React/GamePage';
import { ProtectedRoute } from '../../Login/React/ProtectedRoute';
import { CharacterImage } from '../../CharacterImage/React/CharacterImage';
import { Nav } from 'react-bootstrap';

// Use the hash router instead of a browser router so that refreshes and direct-links to pages work.
//https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
export default function LandingSpace() {
    return (
        <div className="landing-space">
            <div className="page-nav">
                <Nav defaultActiveKey="/">
                    <Nav.Link href="/#/character_creator" eventKey="character_creator">Character Creator</Nav.Link>
                    <Nav.Link href="/" eventKey="login">Login</Nav.Link>
                </Nav>
            </div>
            <div className="page-content">
                <Router>
                    <Switch>
                        <Route exact path="/" children={<LoginPage />} />
                        <Route exact path="/character_creator" children={<CharacterImage />} />
                    </Switch>
                </Router>
            </div>
        </div>
    )
}

// <ProtectedRoute path="/" children={<GamePage />} />
// <Nav.Link href="/#/" eventKey="/">Home</Nav.Link>
