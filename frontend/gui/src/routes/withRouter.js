import React from "react";
import { useParams, useLocation, matchPath, useHref } from "react-router";
import { paths } from "./patternPaths";

const { useNavigate } = require("react-router");
export const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // let match = matchPath("/home/documents/:id/", location.pathname);
  let match = null;
  for (let i in paths) {
    let temp = matchPath(paths[i], location.pathname);
    if (temp !== null) {
      match = temp;
      break;
    }
  }

  // etc... other react-router-dom v6 hooks
  return (
    <WrappedComponent
      {...props}
      params={params}
      navigate={navigate}
      location={location}
      href={useHref}
      match={match}
      // etc...
    />
  );
};
