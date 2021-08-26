import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogged } from "../../const/isLogged";

/*change render to component when it want to charge a component*/
const PrivateRoute = ({ render: Component, ...rest }) => {
	/*select path to login in accordance with user type*/
	var path_to_login = "/login/";
	if (rest.user_type === "admin") path_to_login = "/admin/login/";
	return (
		<Route
			{...rest}
			render={(props) =>
				isLogged() ? (
					<Component {...props} />
				) : (
					<Redirect to={path_to_login} />
				)
			}
		/>
	);
};

export default PrivateRoute;
