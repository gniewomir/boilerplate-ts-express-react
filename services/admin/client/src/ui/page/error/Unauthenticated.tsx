import {config} from "../../../config";
import {Redirect} from "react-router";
import React from "react";


export const Unauthenticated = () => {
    return <Redirect to={config.routes.login.path}/>
}