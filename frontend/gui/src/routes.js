import React from "react";
import { Route } from "react-router-dom";
//import PrivateRoute from "./private.js";
import Cover from "./components/Cover";
import Account from "./components/Account";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Home from "./containers/Home";

const BaseRouter = () => (
  <div>
    <Route exact path="/" component={Cover} />
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/home/" component={Home} />
    <Route exact path="/account/" component={Account} />
  </div>
);

export default BaseRouter;
