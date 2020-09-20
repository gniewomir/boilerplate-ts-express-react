import React from "react";
import {CircularProgress} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh'
    },
    loader: {
        marginTop: '30vh'
    },
}));

export const Loader = () => {
    const classes = useStyles();
    return <Grid container justify="center" className={classes.container}>
        <CssBaseline/>
        <CircularProgress className={classes.loader}/>
    </Grid>;
}