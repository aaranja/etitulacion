import React from "react";
import { Route, Redirect } from "react-router-dom";
import AccountList from "./containers/AccountList";
import AccountDetail from "./containers/AccountDetail";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Home from "./containers/Home";

const BaseRouter = () => (
  <div>
    <Route exact path="/" component={AccountList} />
    <Route exact path="/account/:accountID" component={AccountDetail} />
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/home/" component={Home} />
  </div>
);

function PublicHomePage() {
  return <h3>Publico</h3>;
}
//<Route exact path="/home/" component={Home} />
export default BaseRouter;
