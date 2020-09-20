import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import * as serviceWorker from './serviceWorker';
import {store} from './state';
import {AppConnected} from "./ui/App";
// because: https://github.com/mui-org/material-ui/issues/13394
import {ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme} from '@material-ui/core/styles';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={createMuiTheme()}>
                <AppConnected/>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
