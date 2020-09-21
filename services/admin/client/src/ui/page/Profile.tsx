import {connect} from "react-redux";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {
    selectApiValidationErrors,
    selectIsAuthenticated,
    selectIsAuthenticationPending,
    selectUser,
    UPDATE
} from "../../state/authentication";
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useForm} from "react-hook-form";
import {RootState} from "../../state/root";
import {XSCardCentered} from "./layout/XSCardCentered";
import {Unauthenticated} from "./error/Unauthenticated"
import {ApiValidationErrors, IRegisterCredentialsInput, IUserResponse} from "../../type/api";
import {FormError} from "../component/FormError";

interface IProfileActions {
    update: (input: IRegisterCredentialsInput) => void
}

interface IProfileProps extends IProfileActions {
    pending: boolean,
    isAuthenticated: boolean,
    apiValidationErrors: ApiValidationErrors
    user: IUserResponse
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.success.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
}));

export const Profile = ({apiValidationErrors, pending, isAuthenticated, user, update}: IProfileProps) => {
    const classes = useStyles();
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = handleSubmit(data => update(data as IRegisterCredentialsInput));

    if (!isAuthenticated) {
        return <Unauthenticated/>
    }

    return (
        <XSCardCentered copyright={true} navigation={true}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Profile
            </Typography>
            <form className={classes.form} noValidate onSubmit={onSubmit}>
                <TextField
                    defaultValue={user.name}
                    inputRef={register({required: "Name is required.", minLength: 3})}
                    aria-invalid={'name' in errors || 'name' in apiValidationErrors ? "true" : "false"}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoFocus
                />
                <FormError field='name' formErrors={errors}
                           formMessages={{'minLength': 'At least 3 characters are required.'}}
                           apiErrors={apiValidationErrors}/>
                <TextField
                    defaultValue={user.email}
                    inputRef={register({required: "Email is required."})}
                    aria-invalid={'email' in errors || 'email' in apiValidationErrors ? "true" : "false"}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="username"
                    autoFocus
                />
                <FormError field='email' formErrors={errors} formMessages={{}} apiErrors={apiValidationErrors}/>
                <TextField
                    defaultValue=''
                    inputRef={register({required: false, minLength: 12})}
                    aria-invalid={'password' in errors || 'password' in apiValidationErrors ? "true" : "false"}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                />
                <FormError field='password' formErrors={errors}
                           formMessages={{'minLength': 'At least 12 characters are required.'}}
                           apiErrors={apiValidationErrors}/>
                <Button
                    disabled={pending}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Update
                </Button>
            </form>
        </XSCardCentered>
    );
}

export const ProfileConnected = connect(
    (state: RootState) => ({
        pending: selectIsAuthenticationPending(state),
        isAuthenticated: selectIsAuthenticated(state),
        apiValidationErrors: selectApiValidationErrors(state),
        user: selectUser(state)
    }),
    (dispatch: ThunkDispatch<IRegisterCredentialsInput, void, Action>) => {
        return {
            update: (input: IRegisterCredentialsInput) => dispatch(UPDATE(input))
        }
    }
)(Profile);