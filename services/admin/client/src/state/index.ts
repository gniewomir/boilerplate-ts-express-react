import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./root";
import {selectToken} from "./authentication";
import {Container} from "typedi";
import {Api} from "../app/Api";

export const store = configureStore({
    reducer: rootReducer
})

store.subscribe(() => {
    (Container.get(Api) as Api).setToken(selectToken(store.getState()))
})
