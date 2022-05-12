import React from "react"
import {useParams} from "react-router-dom";

const withParams = (Component: Component) => {
    return props => <Component {...props} params={useParams()}/>;
}

export default withParams;