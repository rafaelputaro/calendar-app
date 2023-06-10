import {Navigate}  from "react-router-dom";
import {PropTypes}  from "prop-types";

export const PrivateRoute = (
        {
            component: Component,
            isAuthenticated,
            ...props
        }
    ) => {
        if (isAuthenticated) {
            return <Component {...props}/>;
        } else {
            return <Navigate to='/login'/>;
        }
}

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}