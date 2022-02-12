import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useParams } from "react-router";

const isLogged = () => {
  return !!localStorage.getItem("token");
};

/*change render to component when it want to charge a component*/
const PrivateRoute = ({ element: Component, ...rest }) => {
  /*select path to login in accordance with user type*/
  let path_to_login = "/login/";
  const params = useParams();
  if (rest.usertype === "admin") path_to_login = "/admin/login/";
  return isLogged() ? (
    <Outlet {...rest} params={params} />
  ) : (
    <Navigate to={path_to_login} params={params} />
  );
};

export default PrivateRoute;
