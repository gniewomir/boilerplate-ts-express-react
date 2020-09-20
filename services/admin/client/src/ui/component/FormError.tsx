import Alert from "@material-ui/lab/Alert";
import React from "react";
import {FieldError, FieldErrors} from "react-hook-form/dist/types/errors";
import {ApiValidationErrors} from "../../type/api";

interface IFormErrorProps {
    field: string,
    formErrors: FieldErrors,
    apiErrors?: ApiValidationErrors
    formMessages: IFormErrorMessages
}

type IFormErrorMessages = { [id: string]: string }

const getFormErrorMessage = (field: string, error: FieldError, messages: IFormErrorMessages): string => {
    if (error.type in messages) {
        return messages[error.type];
    }
    if ('message' in error && error.message) {
        return error.message;
    }
    if (error.type === 'required') {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }
    return `Validation error "${error.type}".`;
}

export const FormError = ({field, formErrors, formMessages = {}, apiErrors = {}}: IFormErrorProps) => {
    return (
        <div>
            {field in formErrors && (
                <Alert severity="error">{getFormErrorMessage(field, formErrors[field], formMessages)}</Alert>)}
            {field in apiErrors && <Alert severity="error">{apiErrors[field]}</Alert>}
        </div>
    )
}