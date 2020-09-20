import React from "react";
import {connect} from "react-redux";
import {RootState} from "../../state/root";
import {LOGOUT, selectIsAuthenticated} from "../../state/authentication";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import {config} from "../../config";
import Menu from "@material-ui/core/Menu";
import {RouterMenuItem} from "./RouterMenuItem";

interface INavigationProps extends INavigationActions {
    isAuthenticated: boolean
}

interface INavigationActions {
    logout: () => void
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appbar: {
        border: '1px solid transparent'
    }
}));

export const Navigation = ({isAuthenticated, logout}: INavigationProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <nav>
            <AppBar position="static" color={"transparent"} variant={"outlined"} className={classes.appbar}>
                <Toolbar>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {!isAuthenticated
                            ? <RouterMenuItem to={config.routes.register.path}
                                              onClick={handleClose}>{config.routes.register.name}</RouterMenuItem>
                            : null}
                        {!isAuthenticated
                            ? <RouterMenuItem to={config.routes.login.path}
                                              onClick={handleClose}>{config.routes.login.name}</RouterMenuItem>
                            : null}
                        {isAuthenticated
                            ? <RouterMenuItem to={config.routes.profile.path}
                                              onClick={handleClose}>{config.routes.profile.name}</RouterMenuItem>
                            : null}
                        {isAuthenticated
                            ? <RouterMenuItem to={config.routes.login.path}
                                              onClick={() => {
                                                  handleClose();
                                                  logout();
                                              }}>Logout</RouterMenuItem>
                            : null}
                    </Menu>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                                onClick={handleClick}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {config.website.name}
                    </Typography>
                </Toolbar>
            </AppBar>
        </nav>
    )
}

export const NavigationConnected = connect(
    (state: RootState) => ({
        isAuthenticated: selectIsAuthenticated(state),
    }),
    (dispatch: ThunkDispatch<never, any, Action>) => {
        return {
            logout: () => dispatch(LOGOUT())
        }
    }
)(Navigation);