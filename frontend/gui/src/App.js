import React, { Component } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";

import Layout from "./containers/Layout";
import * as actions from "./store/actions/auth";


let self;

export class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
      }

  render() {
    return (
      <div>
        <Router>
          <Layout {...this.props}>
            <BaseRouter />
          </Layout>
        </Router>
      </div>
    );
  }
}

function mapStateToProps (state,ownProps ={} ){
  console.log(state);
  //console.log(ownProps) // {}
  return {
    isAuthenticated: state.token !== null,
  };
};



const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
