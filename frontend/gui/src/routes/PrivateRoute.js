import React from "react";
import {Navigate, useParams} from "react-router-dom";
import Home from "../pages/Home";

const isLogged = () => {
    return !!localStorage.getItem("token");
};

const PrivateRoute = ({element: Component, ...rest}) => {

    let path_to_login = "/login";
    const params = useParams();

    return isLogged() ? <Home {...rest} {...params}/> : <Navigate to={path_to_login} params={params}/>
}

export default PrivateRoute;