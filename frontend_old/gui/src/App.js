import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import NormalLayout from "./containers/Layout";
import BaseRouter from "./routes/baseRouter";
import { authCheckState } from "./store/actions/auth";

import "antd/dist/antd.css";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div>
        <Router>{this.props.layout}</Router>
      </div>
    );
  }
}

const mergeProps = (ownProps, mapProps, dispatchProps) => {
  return {
    layout: (
      <NormalLayout {...ownProps}>
        <BaseRouter {...ownProps} />
      </NormalLayout>
    ),
    ...mapProps,
    ...dispatchProps,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authCheckState()),
  };
};

export default connect(null, mapDispatchToProps, mergeProps)(App);
