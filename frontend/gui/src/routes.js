import React from "react";
import { Switch } from "react-router-dom";
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
