import {Typography} from "@material-ui/core";
import {XSCardCentered} from "../layout/XSCardCentered";
import React from "react";


export const NotImplemented = () => {
    return <XSCardCentered copyright={false} navigation={true}>
        <Typography component="h1" variant="h5">
            Not implemented
        </Typography>
    </XSCardCentered>
}