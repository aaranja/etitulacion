import React from "react";
import { Switch } from "react-router-dom";
//import PrivateRoute from "./private.js";
import Cover from "./components/Cover";
import Account from "./components/Account";
//import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Home from "./containers/Home";

import PublicRoute from "./components/Router/public";
import PrivateRoute from "./components/Router/private";
import Login from './pages/Login'
import Canvas from './containers/Canvas'



const BaseRouter = () => (
  <Switch>
      <PublicRoute path="/login" component={Login} />
      <PrivateRoute paht="/" component={Canvas} />
  </Switch>
);

export default BaseRouter;
