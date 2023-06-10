import {Navigate}  from "react-router-dom";
import {PropTypes}  from "prop-types";

export const PublicRoute = (
        {
            component: Component,
            isAuthenticated,
            ...props
        }
    ) => {
        if (isAuthenticated) {
            return <Navigate to='/'/>;
        } else {
            return <Component {...props}/>;
        }
}

PublicRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}