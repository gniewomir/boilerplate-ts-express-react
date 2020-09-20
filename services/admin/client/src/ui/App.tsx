import {connect} from "react-redux";
import {RootState} from "../state/root";
import {LOGIN_WITH_REFRESH_TOKEN, selectIsAuthenticated, selectIsLoggedOut} from "../state/authentication";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {config} from "../config";
import {RegisterConnected} from "./page/Register";
import {LoginConnected} from "./page/Login";
import {ProfileConnected} from "./page/Profile";
import {Home} from "./page/Home";
import React from "react";
import {NotFound} from "./page/error/NotFound";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {Loader} from "./page/Loader";
import {NotImplemented} from "./page/error/NotImplemented";

interface IAppActions {
    loginWithRefreshToken: () => void
}

interface IAppProps extends IAppActions {
    useRefreshToken: boolean
}

export const App = ({useRefreshToken, loginWithRefreshToken}: IAppProps) => {

    if (useRefreshToken) {
        loginWithRefreshToken();
        return <Loader/>;
    }

    return (
        <Router>
            <Switch>
                <Route path={config.routes.register.path}>
                    <RegisterConnected/>
                </Route>
                <Route path={config.routes.login.path}>
                    <LoginConnected/>
                </Route>
                <Route path={config.routes.password_reset.path}>
                    <NotImplemented/>
                </Route>
                <Route path={config.routes.profile.path}>
                    <ProfileConnected/>
                </Route>
                <Route exact path={config.routes.home.path}>
                    <Home/>
                </Route>
                <Route path={config.routes.home.path}>
                    <NotFound/>
                </Route>
            </Switch>
        </Router>
    );
};
export const AppConnected = connect(
    (state: RootState) => ({
        useRefreshToken: !selectIsAuthenticated(state) && !selectIsLoggedOut(state),
    }),
    (dispatch: ThunkDispatch<never, void, Action>) => {
        return {
            loginWithRefreshToken: () => dispatch(LOGIN_WITH_REFRESH_TOKEN())
        }
    }
)(App);