/* Class HOME: to manage all diferents views to differents users
 */
import React from "react";
import { connect } from "react-redux";
import Process from "../../../containers/Graduate/Process";
import Staff from "../../../containers/Staff";
import * as userTypes from "../../collections/userTypes";

class Home extends React.Component {
  // constructor(props) {
  //   super(props);
  //   console.log(props);
  // }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /* no update the component if user type or status aren't changed */
    if (this.props.loading !== nextProps.loading) {
      if (this.props.user !== null) {
        if (nextProps.user_type === this.props.user_type) return false;
      }
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.loading) {
      //when isn't loading the logging
      if (this.props.error != null) {
        console.log(this.props.error);
      } else {
      }
    }
  }

  render() {
    const userView = (user_type) => {
      if (this.props.loading !== true && user_type !== null) {
        switch (user_type) {
          case userTypes.USER_GRADUATE:
            return <Process />;
          case userTypes.USER_SERVICES:
          case userTypes.USER_COORDINAT:
            return (
              <Staff
                match={this.props.init}
                user={user_type}
                pathname={this.props.pathname}
              />
            );
          default:
            return <p>Ha ocurrido un error, no se puede cargar la página</p>;
        }
      } else {
        /*if data is still loading*/
        return <p> CARGANDO </p>;
      }
    };

    /* render a different view according to user type*/
    return userView(this.props.init.usertype);
  }
}

export default connect(null, null)(Home);
