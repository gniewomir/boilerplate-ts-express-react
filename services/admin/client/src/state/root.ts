import {combineReducers} from '@reduxjs/toolkit'
import {reducer as authentication} from './authentication'


export const rootReducer = combineReducers({
    authentication
})
export type RootState = ReturnType<typeof rootReducer>


