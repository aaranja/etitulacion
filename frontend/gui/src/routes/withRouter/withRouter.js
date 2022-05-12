import React from "react"
import {useNavigate, useParams, useLocation} from "react-router-dom";

const withRouter = (Component: Component) => {
    return props => <Component {...props} navigate={useNavigate()} params={useParams()} location={useLocation()}/>;
}

export default withRouter;