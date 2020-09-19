import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Container} from "typedi";
import {Api} from "../app/Api";
import {
    IApiError,
    ILoginCredentialsInput,
    IRegisterCredentialsInput,
    ITokenPayload,
    IUserResponse,
    ValidationErrors
} from "../type/api";
import {RootState} from "./root";
import jwt from "jsonwebtoken";

interface IAuthenticationState {
    pending: boolean,
    token: string,
    error: IApiError
    user: IUserResponse
}

interface ILoginAction {
    type: string,
    payload: {
        user: IUserResponse,
        token: string
    }
}

const apiConnection = Container.get(Api);
const name = 'authentication';
const noError = {
    statusCode: 0,
    message: '',
    error: '',
    validation: {}
} as IApiError;
const noUser = {
    id: 0,
    name: '',
    email: ''
} as IUserResponse;
const noToken = '';

export const LOGIN = createAsyncThunk(
    `${name}/LOGIN`,
    async (credentials: ILoginCredentialsInput, thunkAPI) => {
        try {
            const token = await apiConnection.PostToken(credentials);
            const tokenPayload = jwt.decode(token.token) as ITokenPayload;
            apiConnection.setToken(token.token);
            return {
                token: token.token,
                user: await apiConnection.GetUser(tokenPayload.userId)
            }
        } catch (error) {
            apiConnection.setToken(noToken);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const LOGOUT = createAsyncThunk(
    `${name}/LOGOUT`,
    async (arg, thunkAPI) => {
        try {
            return await apiConnection.DeleteToken();
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const REGISTER = createAsyncThunk(
    `${name}/REGISTER`,
    async (credentials: IRegisterCredentialsInput, thunkAPI) => {
        try {
            return await apiConnection.PostUser(credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const {actions, reducer} = createSlice({
    name,
    initialState: {
        pending: false,
        token: noToken,
        user: noUser,
        error: noError
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(
            LOGIN.pending,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: true,
                    error: noError,
                }
            })
        builder.addCase(
            LOGIN.fulfilled,
            (state: IAuthenticationState, action: ILoginAction): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: action.payload.token,
                    user: action.payload.user,
                }
            })
        builder.addCase(
            LOGIN.rejected,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: noToken,
                    user: noUser,
                    error: action.payload as IApiError
                }
            })
        builder.addCase(
            LOGOUT.pending,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: true,
                }
            })
        builder.addCase(
            LOGOUT.fulfilled,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: noToken,
                    error: noError,
                }
            })
        builder.addCase(
            LOGOUT.rejected,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: noToken,
                    error: noError,
                }
            })
        builder.addCase(
            REGISTER.pending,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: true,
                }
            })
        builder.addCase(
            REGISTER.rejected,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: noToken,
                    error: action.payload as IApiError,
                    user: noUser
                }
            })
        builder.addCase(
            REGISTER.fulfilled,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    token: noToken,
                    error: noError,
                    user: action.payload
                }
            })

    }
});
export type AuthenticationState = ReturnType<typeof reducer>

const selectAuthentication = (state: RootState): AuthenticationState => state.authentication;

export const selectToken = (state: RootState): string => selectAuthentication(state).token;

export const selectIsPending = (state: RootState): boolean => selectAuthentication(state).pending;
export const selectIsAuthenticated = (state: RootState): boolean => !selectHasError(state) && selectToken(state) !== '';

export const selectHasUser = (state: RootState): boolean => selectAuthentication(state).user.id !== 0;
export const selectHasError = (state: RootState): boolean => selectAuthentication(state).error.statusCode !== noError.statusCode;

export const selectHasInvalidCredentialsError = (state: RootState): boolean => selectAuthentication(state).error.statusCode === 401 && selectToken(state) === '';
export const selectHasApiValidationErrors = (state: RootState): boolean => selectAuthentication(state).error.statusCode === 400;

export const selectApiValidationErrors = (state: RootState): ValidationErrors => selectAuthentication(state).error.validation;
export const selectUser = (state: RootState): IUserResponse => selectAuthentication(state).user;
