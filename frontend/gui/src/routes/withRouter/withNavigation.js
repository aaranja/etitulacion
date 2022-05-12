import React from "react"
import {useNavigate} from "react-router-dom";

const withNavigation = (Component: Component) => {
    return props => <Component {...props} navigate={useNavigate()}/>;
}

export default withNavigation