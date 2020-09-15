import React from "react";
import {Link} from "@reach/router";

export default () => {
    return <nav>
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
            <li>
                <Link to="/profile/1">Profile #1</Link>
            </li>
        </ul>
    </nav>;
}