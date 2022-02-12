import React from "react";
import { Route, Routes } from "react-router";
import PrivateRoute from "./private";

import Home from "../site/pages/Home";
import Login from "../site/pages/Login";
import Register from "../site/pages/Register";
import AdminLogin from "../site/pages/AdminLogin";
import AdminPanel from "../site/pages/AdminPanel";
import SettingsPanel from "../site/pages/Settings";

const BaseRouter = (props) => (
  <Routes>
    <Route restricted={false} exact path="/" element={<Login {...props} />} />
    <Route
      restricted={false}
      exact
      path="/login/"
      element={<Login {...props} />}
    />
    <Route
      restricted={false}
      exact
      path="/signup/"
      element={<Register {...props} />}
    />
    <Route
      restricted={false}
      exact
      path="/admin/login/"
      element={<AdminLogin {...props} />}
    />
    <Route exact path="/admin/" element={<PrivateRoute />}>
      <Route exact path="panel/" element={<AdminPanel init={props} />} />
    </Route>
    <Route exact path="/home/" element={<PrivateRoute />}>
      <Route exact path="" element={<Home init={props} pathname={"home"} />} />
      <Route
        exact
        path="coordination/inauguration-dates/"
        element={<Home init={props} pathname={"inauguration"} />}
      />
      <Route
        exact
        path="services/aep-dates/"
        element={<Home init={props} pathname={"aeprofesional"} />}
      />
      <Route
        exact
        path="coordination/arp-dates/"
        element={<Home init={props} pathname={"arp"} />}
      />
      <Route
        exact
        path="documents/:id/"
        element={<Home init={props} pathname={"documents"} />}
      />
      <Route
        exact
        path="dossier/:id/"
        element={<Home init={props} pathname={"dossier"} />}
      />
      <Route
        exact
        path="services/aep-liberation/:id/"
        element={<Home init={props} pathname={"aepliberation"} />}
      />
      <Route exact path="services/settings/" element={<SettingsPanel />} />
    </Route>
  </Routes>
);

export default BaseRouter;
