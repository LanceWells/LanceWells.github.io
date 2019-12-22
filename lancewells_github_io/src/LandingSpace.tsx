import './css/LandingSpace.css';

import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {CharacterCreator, ICharacterCreatorProps} from './CharacterCreator';

interface ILandingSpaceProps {
};

interface ILandingSpaceState {
};

export default function LandingSpace() {
    const charCreatorProps: ICharacterCreatorProps = {};

    return (
        <div className="page-nav">
            <Router>
                <Switch>
                    <Route exact path="/" children={<Home />} />
                    <Route path="/creatorPage" children={ <CharacterCreator /> } />
                </Switch>
            </Router>
        </div>
    )
}

function Home() {
    return (
        <div className="nav-bar">
            <h1>Here Be Links</h1>
            <h2 className="nav-entry">
                <Link to="/creatorPage">
                    &gt;&gt;&gt; DnD Character Creator &lt;&lt;&lt;
                </Link>
            </h2>
        </div>
    );
}