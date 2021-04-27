import React from "react";
import { Route } from "react-router-dom";
//import PrivateRoute from "./private.js";
//import Account from "./components/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

const BaseRouter = () => (
	<div>
		<Route exact path="/login/" component={Login} />
		<Route exact path="/signup/" component={Register} />
		<Route exact path="/home/" render={(props) => <Home {...props} />} />
		{/*<Route exact path="/account/" component={Account} />*/}
	</div>
);

export default BaseRouter;
