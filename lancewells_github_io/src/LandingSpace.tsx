import './css/LandingSpace.css';

import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {CharacterCreator} from './CharacterCreator/React/CharacterCreator';
import {ItemShop} from './Items/React/Shop/ItemShop';
import {Inventory} from './Items/React/Inventory/Inventory';
import {LoginPage} from './Login/React/LoginPage';
import { ProtectedRoute } from './Login/React/ProtectedRoute';

interface ILandingSpaceProps {
};

interface ILandingSpaceState {
};

// Use the hash router instead of a browser router so that refreshes and direct-links to pages work.
//https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
export default function LandingSpace() {
    return (
        <div className="page-nav">
            <Router>
                <Switch>
                    <Route exact path="/" children={<Home />} />
                    <Route exact path="/login" children={<LoginPage />} />
                    <Route path="/creatorPage" children={<CharacterCreator />} />
                    <ProtectedRoute path="/itemShop" children={<ItemShop />} />
                    <ProtectedRoute path="/inventory" children={<Inventory />} />
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
                <Link to="/login">
                    &gt;&gt;&gt; Login Page &lt;&lt;&lt;
                </Link>
            </h2>
            <h2 className="nav-entry">
                <Link to="/creatorPage">
                    &gt;&gt;&gt; DnD Character Creator &lt;&lt;&lt;
                </Link>
            </h2>
            <h2 className="nav-entry">
                <Link to="/itemShop">
                    &gt;&gt;&gt; DnD Item Shop &lt;&lt;&lt;
                </Link>
            </h2>
            <h2 className="nav-entry">
                <Link to="/inventory">
                    &gt;&gt;&gt; DnD Item Inventory &lt;&lt;&lt;
                </Link>
            </h2>
        </div>
    );
}
