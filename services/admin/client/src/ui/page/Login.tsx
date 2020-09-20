import {connect} from "react-redux";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {ApiValidationErrors, ILoginCredentialsInput} from "../../type/api";
import {LOGIN, selectApiValidationErrors, selectIsAuthenticated, selectIsPending} from "../../state/authentication";
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useForm} from "react-hook-form";
import {RootState} from "../../state/root";
import {XSCardCentered} from "./layout/XSCardCentered";
import {Redirect} from "react-router";
import {config} from "../../config";
import {FormError} from "../component/FormError";

interface ILoginActions {
    login: (credentials: ILoginCredentialsInput) => void
}

interface ILoginProps extends ILoginActions {
    pending: boolean,
    isAuthenticated: boolean
    apiValidationErrors: ApiValidationErrors
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.warning.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export const Login = ({login, pending, apiValidationErrors, isAuthenticated}: ILoginProps) => {
    const classes = useStyles();
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = handleSubmit((data) => login(data as ILoginCredentialsInput));

    if (isAuthenticated) {
        return <Redirect to={config.routes.home.path}/>
    }

    return (
        <XSCardCentered copyright={true} navigation={true}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Login
            </Typography>
            <form className={classes.form} noValidate onSubmit={onSubmit}>
                <TextField
                    error={'email' in errors || 'email' in apiValidationErrors}
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
                    error={'password' in errors || 'password' in apiValidationErrors}
                    inputRef={register({required: "Password is required", minLength: 12})}
                    aria-invalid={'password' in errors || 'password' in apiValidationErrors ? "true" : "false"}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <FormError field='password' formErrors={errors}
                           formMessages={{'minLength': 'At least 12 characters are required.'}}
                           apiErrors={apiValidationErrors}/>
                <FormControlLabel
                    control={<Checkbox name={'remember'} inputRef={register} defaultValue={"remember"}
                                       color="primary"/>}
                    label="Remember me"
                />
                <Button
                    disabled={pending}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href={config.routes.password_reset.path} variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href={config.routes.register.path} variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </XSCardCentered>
    );
}

export const LoginConnected = connect(
    (state: RootState) => ({
        pending: selectIsPending(state),
        isAuthenticated: selectIsAuthenticated(state),
        apiValidationErrors: selectApiValidationErrors(state)
    }),
    (dispatch: ThunkDispatch<ILoginCredentialsInput, void, Action>) => {
        return {
            login: (credentials: ILoginCredentialsInput) => dispatch(LOGIN(credentials))
        } as ILoginActions
    }
)(Login);