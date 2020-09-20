import React from 'react';
import {Link as RouterLink, LinkProps as RouterLinkProps} from 'react-router-dom';
import MenuItem from "@material-ui/core/MenuItem";

interface RouterMenuItemProps extends React.PropsWithChildren<RouterLinkProps> {
    onClick: () => void,
    to: string;
}

export const RouterMenuItem = ({to, onClick, children}: RouterMenuItemProps) => {
    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
                <RouterLink to={to} ref={ref} {...itemProps} />
            )),
        [to],
    );

    return (
        <MenuItem component={renderLink} onClick={onClick}>{children}</MenuItem>
    );
}