import {Button} from "@material-ui/core";
import React from "react";
import {IRoutableProps} from "../../type/IRoutableProps";

interface IPageProfileProps extends IRoutableProps {
    userId?: number
}

export default (props: IPageProfileProps) => {
    return <Button variant="contained" color="primary">Profile #{props.userId}</Button>;
}