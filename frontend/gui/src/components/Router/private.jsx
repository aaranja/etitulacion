import React from "react";
import {Route} from "react-router-dom"
import P401 from "../../pages/ErrorCode/401";

function PrivateRoute({component: Component, ...rest}) {
    return (<Route {...rest} render={props => localStorage.getItem('token') ? (<Component {...props} />) : (
        <Route component={P401} />)}/>);
}

export default PrivateRoute;

