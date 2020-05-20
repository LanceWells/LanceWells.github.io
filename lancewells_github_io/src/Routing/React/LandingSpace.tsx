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
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Inventory } from '../../Inventory/React/Inventory';
import { CharacterManager } from '../../CharacterManager/React/CharacterManager';
import { CharacterInfoDisplay } from '../../CharacterInfo/React/CharacterInfoDisplay';
import { LoginState } from '../../LoginPage/Enums/LoginState';
import { Shop } from '../../Shops/React/ShopPage';
import { ChestPage } from '../../Chests/React/ChestPage';
import { ShopCreator } from '../../ItemContainerManagement/React/ShopCreator';

export interface ILandingSpaceProps {
}

export interface ILandingSpaceState {
    loginState: LoginState;
}

// Use the hash router instead of a browser router so that refreshes and direct-links to pages work.
//https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
export class LandingSpace extends React.Component<ILandingSpaceProps, ILandingSpaceState> {
    public constructor(props: ILandingSpaceProps) {
        super(props);
        this.state = {
            loginState: LoginState.Login
        };
    }

    public render() {
        return (
            <div className="landing-space">
                <div className="page-nav">
                    <Navbar expand="lg" variant="dark">
                        <Navbar.Brand style={{ color: "white" }} href="/">LantsPants.com</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-pagebar-nav" />
                        <Navbar.Collapse>
                            <Nav defaultActiveKey="/">
                                <Nav.Link
                                    href="/#/character_creator"
                                    eventKey="character_creator"
                                    >
                                    Character Creator
                                </Nav.Link>
                                <NavDropdown
                                    title="Player Tools"
                                    id="Player Tools Dropdown"
                                    >
                                    <NavDropdown.Item
                                        href="/#/inventory"
                                        eventKey="inventory">
                                        Inventory
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href="/#/characterManager"
                                        eventKey="characterManager">
                                        Characters
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown
                                    title="DM Tools"
                                    id="DM Tools Dropdown"
                                    >
                                    <NavDropdown.Item
                                        href="/#/shopCreator"
                                        eventKey="shopCreator">
                                        Shop Creator
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <CharacterInfoDisplay
                                loginState={this.state.loginState}
                            />
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className="page-content">
                    <Router>
                        <Switch>
                            <Route exact path="/" children={<LoginPage onLogin={this.HandleLoginStateChange.bind(this)}/>} />
                            <Route exact path="/login" children={<LoginPage onLogin={this.HandleLoginStateChange.bind(this)}/>} />
                            <Route exact path="/character_creator" children={<CharacterImage />} />
                            <Route path="/shop" children={<Shop loginState={this.state.loginState} />} />
                            <Route path="/chest" children={<ChestPage loginState={this.state.loginState} />} />
                            <ProtectedRoute path="/inventory" children={<Inventory loginState={this.state.loginState}/>} />
                            <ProtectedRoute path="/characterManager" children={<CharacterManager />} />
                            <ProtectedRoute path="/shopCreator" children={<ShopCreator />} />
                        </Switch>
                    </Router>
                </div>
            </div>
        )
    }

    private HandleLoginStateChange(loginState: LoginState) {
        this.setState({
            loginState: loginState
        });
    }
}
