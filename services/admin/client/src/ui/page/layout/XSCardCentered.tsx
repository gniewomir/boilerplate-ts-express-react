import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ILayoutProps} from "../../../type/layout";
import {Copyright} from "../../component/Copyright";
import {NavigationConnected} from "../../component/Navigation";

interface IXSCard extends ILayoutProps {
    children: any
}

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh'
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export const XSCardCentered = ({children, copyright, navigation}: IXSCard) => {
    const classes = useStyles();
    return (
        <Container className={classes.container} maxWidth="lg">
            <CssBaseline/>
            {navigation ? <NavigationConnected/> : null}
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    {children}
                </div>
            </Container>
            {copyright ? <Copyright/> : null}
        </Container>)
}