import React from "react";
import {Route, Redirect} from "react-router-dom";
//import P403 from "./components/403";
//import NormalLoginForm from "./containers/Login";

function PrivateRoute({component: Component, ...props}){
	return (<Route {...props} render={props => localStorage.getItem('token') ? (<Component {...props} />) : (<Redirect to="/login/" />) }  />   );
}

export default PrivateRoute;