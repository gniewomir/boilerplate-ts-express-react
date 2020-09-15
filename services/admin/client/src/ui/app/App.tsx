import React from 'react';
import {Container} from '@material-ui/core';
import {Link, Router} from "@reach/router"
import Login from "../page/Login";
import Profile from "../page/Profile";
import Register from "../page/Register";
import Home from "../page/Home";
import Navigation from "../component/Navigation";

export default () => {
    return (
        <Container maxWidth="lg">
            <Navigation />
            <Router>
                <Register path="/register"/>
                <Login path="/login"/>
                <Profile path="/profile"/>
                <Profile path="/profile/:userId"/>
                <Home path="/"/>
            </Router>
        </Container>
    );
};
