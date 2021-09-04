import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
//import Account from "./components/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

const BaseRouter = () => (
	<div>
		<Route restricted={false} exact path="/login/" component={Login} />
		<Route restricted={false} exact path="/signup/" component={Register} />
		<PrivateRoute
			exact
			path="/home/"
			user_type="normal"
			render={(props) => <Home {...props} />}
		/>
		<PrivateRoute
			exact
			path="/home/documents/:id"
			user_type="normal"
			render={(props) => <Home {...props} />}
		/>
		<Route
			exact
			path="/admin/login/"
			render={(props) => <AdminLogin {...props} />}
		/>
		<PrivateRoute
			exact
			path="/admin/panel/"
			user_type="admin"
			render={(props) => <AdminPanel {...props} />}
		/>
	</div>
);

export default BaseRouter;
