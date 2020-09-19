import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Container} from "typedi";
import {Api} from "../app/Api";
import {IApiError, ILoginCredentialsInput, ValidationErrors} from "../type/api";
import {RootState} from "./root";

interface IAuthenticationState {
    pending: boolean,
    token: string,
    error: IApiError
}

interface ILoginAction {
    type: string,
    payload: { token: string }
}

const apiConnection = Container.get(Api);
const name = 'authentication';
const success = {
    status: 0,
    message: '',
    error: '',
    validation: {}
} as IApiError;

export const LOGIN = createAsyncThunk(
    `${name}/LOGIN`,
    async (credentials: ILoginCredentialsInput, thunkAPI) => {
        try {
            return await apiConnection.login(credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const LOGOUT = createAsyncThunk(
    `${name}/LOGOUT`,
    async (arg, thunkAPI) => {
        try {
            return await apiConnection.logout();
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const {actions, reducer} = createSlice({
    name,
    initialState: {
        pending: false,
        token: '',
        error: success
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(
            LOGIN.pending,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: true,
                    error: success,
                }
            })
        builder.addCase(
            LOGIN.fulfilled,
            (state: IAuthenticationState, action: ILoginAction): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: action.payload.token,
                }
            })
        builder.addCase(
            LOGIN.rejected,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: '',
                    error: action.payload as IApiError
                }
            })
        builder.addCase(
            LOGOUT.fulfilled,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: '',
                    error: success,
                }
            })
        builder.addCase(
            LOGOUT.rejected,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: '',
                    error: success,
                }
            })
    }
});
export type AuthenticationState = ReturnType<typeof reducer>

const selectAuthentication = (state: RootState): AuthenticationState => state.authentication;

export const selectToken = (state: RootState): string => selectAuthentication(state).token;

export const selectIsAuthenticated = (state: RootState): boolean => !selectHasError(state) && selectToken(state) !== '';
export const selectIsPending = (state: RootState): boolean => selectAuthentication(state).pending;

export const selectHasError = (state: RootState): boolean => selectAuthentication(state).error.status !== success.status;

export const selectHasInvalidCredentialsError = (state: RootState): boolean => selectAuthentication(state).error.status === 401 && selectToken(state) === '';
export const selectHasValidationError = (state: RootState): boolean => selectAuthentication(state).error.status === 400;

export const selectValidationErrors = (state: RootState): ValidationErrors => selectAuthentication(state).error.validation;

