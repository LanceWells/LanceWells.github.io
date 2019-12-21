import './css/LandingSpace.css';

import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import CharacterCreator from './CharacterCreator';

interface ILandingSpaceProps {
};

interface ILandingSpaceState {
};

export default function LandingSpace() {
    return (
        <div className="page-nav">
            <Router>
                <div className="nav-bar">
                    <h1>Here Be Links</h1>
                    <h2 className="nav-entry">
                        <Link to="/creatorPage">
                            &gt;&gt;&gt; DnD Character Creator &lt;&lt;&lt;
                        </Link>
                    </h2>
                </div>
                <Switch>
                    <Route path="/creatorPage" component={CharacterCreator} />
                </Switch>
            </Router>
        </div>
    )
}
