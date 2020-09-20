import React from "react";
import {config} from "../../config";
import {Redirect} from "react-router";

export const Home = () => {
    return <Redirect to={config.routes.profile.path}/>;
}