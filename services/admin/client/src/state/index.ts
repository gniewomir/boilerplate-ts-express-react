import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./root";

const configuredStore = configureStore({
    reducer: rootReducer
});

export const store = configuredStore;
export type AppDispatch = typeof store.dispatch

