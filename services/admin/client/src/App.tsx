import React from 'react';
import {Button, Container} from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {
    return (
        <Router>
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
                <Switch>
                    <Route path="/login">
                        <Button variant="contained" color="primary">Login</Button>
                    </Route>
                    <Route path="/register">
                        <Button variant="contained" color="primary">Register</Button>
                    </Route>
                    <Route path="/profile">
                        <Button variant="contained" color="primary">Profile</Button>
                    </Route>
                    <Route path="/">
                        <Button variant="contained" color="primary">Example button</Button>
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}

export default App;
