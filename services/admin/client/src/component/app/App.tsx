import React from 'react';
import {Container} from '@material-ui/core';
import {Link, Router} from "@reach/router"
import Login from "../page/Login";
import Profile from "../page/Profile";
import Register from "../page/Register";
import Home from "../page/Home";

export default () => {
    return (
        <Container maxWidth="lg">
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
            <Router>
                <Register path="/register"/>
                <Login path="/login"/>
                <Profile path="/profile"/>
                <Home path="/"/>
            </Router>
        </Container>
    );
};
