import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Container} from "typedi";
import {Api} from "../app/Api";
import {
    ApiValidationErrors,
    IApiError,
    ILoginCredentialsInput,
    IRegisterCredentialsInput,
    IUserResponse
} from "../type/api";
import {RootState} from "./root";
import {get as getFromLocalStorage, set as setInLocalStorage} from 'local-storage'

interface IAuthenticationState {
    loggedOut: boolean,
    pending: boolean,
    error: IApiError
    user: IUserResponse
}

const apiConnection = Container.get(Api);
const name = 'authentication';
const noError = {
    statusCode: 0,
    message: '',
    error: '',
    validation: {} as ApiValidationErrors
} as IApiError;
const noUser = {
    id: 0,
    name: '',
    email: ''
} as IUserResponse;

export const LOGIN_WITH_REFRESH_TOKEN = createAsyncThunk(
    `${name}/LOGIN_WITH_REFRESH_TOKEN`,
    async (arg, thunkAPI) => {
        try {
            if (selectIsLoggedOut(thunkAPI.getState() as RootState)) {
                return thunkAPI.rejectWithValue(noUser)
            }
            return await apiConnection.GetUserByRefreshToken();
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const LOGIN = createAsyncThunk(
    `${name}/LOGIN`,
    async (credentials: ILoginCredentialsInput, thunkAPI) => {
        try {
            setInLocalStorage('LOGGED_OUT', false);
            return await apiConnection.PostToken(credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as IApiError);
        }
    }
);

export const LOGOUT = createAsyncThunk(
    `${name}/LOGOUT`,
    async (arg, thunkAPI) => {
        try {
            setInLocalStorage('LOGGED_OUT', true);
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

export const UPDATE = createAsyncThunk(
    `${name}/UPDATE`,
    async (credentials: IRegisterCredentialsInput, thunkAPI) => {
        try {
            const user = selectUser(thunkAPI.getState() as RootState);
            if (user.email === credentials.email) {
                delete credentials.email;
            }
            if (user.name === credentials.name) {
                delete credentials.name;
            }
            if (!credentials.password) {
                delete credentials.password;
            }
            return await apiConnection.PatchUser(user.id, credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const {actions, reducer} = createSlice({
    name,
    initialState: {
        loggedOut: getFromLocalStorage('LOGGED_OUT') as boolean,
        pending: false,
        user: noUser,
        error: noError
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(
            LOGIN_WITH_REFRESH_TOKEN.pending,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: true,
                    error: noError,
                }
            })
        builder.addCase(
            LOGIN_WITH_REFRESH_TOKEN.fulfilled,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    user: action.payload,
                }
            })
        builder.addCase(
            LOGIN_WITH_REFRESH_TOKEN.rejected,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    loggedOut: true,
                    user: noUser
                }
            })
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
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    loggedOut: false,
                    user: action.payload,
                }
            })
        builder.addCase(
            LOGIN.rejected,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    loggedOut: true,
                    user: noUser,
                    error: {
                        ...(action.payload as IApiError),
                        validation: {
                            email: "Invalid credentials.",
                            password: "Invalid credentials."
                        }
                    },
                }
            })
        builder.addCase(
            LOGOUT.pending,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    loggedOut: true,
                    pending: true,
                }
            })
        builder.addCase(
            LOGOUT.fulfilled,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    loggedOut: true,
                    user: noUser,
                    error: noError,
                }
            })
        builder.addCase(
            LOGOUT.rejected,
            (state: IAuthenticationState): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    loggedOut: true,
                    user: noUser,
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
                    error: noError,
                    user: action.payload
                }
            })
        builder.addCase(
            UPDATE.pending,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: true,
                    error: noError
                }
            })
        builder.addCase(
            UPDATE.rejected,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    error: action.payload as IApiError
                }
            })
        builder.addCase(
            UPDATE.fulfilled,
            (state: IAuthenticationState, action): IAuthenticationState => {
                return {
                    ...state,
                    pending: false,
                    error: noError,
                    user: action.payload
                }
            })

    }
});
export type AuthenticationState = ReturnType<typeof reducer>

const selectAuthentication = (state: RootState): AuthenticationState => state.authentication;

export const selectUser = (state: RootState): IUserResponse => selectAuthentication(state).user;
export const selectApiValidationErrors = (state: RootState): ApiValidationErrors => selectAuthentication(state).error.validation;

export const selectHasUser = (state: RootState): boolean => selectAuthentication(state).user.id !== 0;
export const selectHasError = (state: RootState): boolean => selectAuthentication(state).error.statusCode !== noError.statusCode;

export const selectIsAuthenticationPending = (state: RootState): boolean => selectAuthentication(state).pending;
export const selectIsAuthenticated = (state: RootState): boolean => selectHasUser(state);
export const selectIsLoggedOut = (state: RootState): boolean => selectAuthentication(state).loggedOut;

export const selectHasAuthenticationError = (state: RootState): boolean => selectAuthentication(state).error.statusCode === 401;
export const selectHasApiValidationErrors = (state: RootState): boolean => !!Object.keys(selectAuthentication(state).error.validation).length;
