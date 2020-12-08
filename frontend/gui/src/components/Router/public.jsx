import React from "react";
import {Route, Redirect} from "react-router-dom"

function PublicRoute({component: Component, ...rest}) {
    return (<Route {...rest} render={props => !localStorage.getItem('token') ? (<Component {...props} />) : (
        <Redirect to={{pathname: "/", state: {from: props.location}}}/>)}/>);
}

export default PublicRoute;
