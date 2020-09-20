import {XSCardCentered} from "../layout/XSCardCentered";
import {Typography} from "@material-ui/core";
import React from "react";

export const NotFound = () => {
    return <XSCardCentered copyright={false} navigation={true}>
        <Typography component="h1" variant="h5">
            Not found
        </Typography>
    </XSCardCentered>
}