import {Grid, Input} from "@material-ui/core";
import React from "react";
import {IRoutableProps} from "../../type/IRoutableProps";

export default (props: IRoutableProps) => {
    return <Grid container xs={12} sm={6} >
        <Grid item >
            <Input fullWidth/>
        </Grid>
        <Grid item>
            <Input fullWidth/>
        </Grid>
    </Grid>;
}