import React, { Component } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";

import NormalLayout from "./containers/Layout";
import * as actions from "./store/actions/auth";

export class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div>
        <Router>
          <NormalLayout {...this.props}>
            <BaseRouter />
          </NormalLayout>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps = {}) {
  return {
    isAuthenticated: state.token !== null,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
