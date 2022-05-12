// class to register a new graduate user
// https://colorhunt.co/palette/0820322c394b334756ff4c29
import React from "react";
import * as action from "../../../store/actions/auth";
import { connect } from "react-redux";
import RegisterGraduateForm from "./RegisterGraduateForm";
import EmailVerification from "./EmailVerification";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoemail: "",
      verification: false,
      email: null,
    };
    this.form = React.createRef();
  }

  onFinish = (values) => {
    this.props.onAuth(values);

    // this.props.onAuth(values);
  };

  setVerification = (email) => {
    this.setState({
      verification: true,
      email: email,
    });
  };

  render() {
    const { verification } = this.state;
    return (
      <div
        className=""
        style={{
          paddingTop: "5vh",
          justifyContent: "center",
        }}
      >
        {!verification ? (
          <RegisterGraduateForm onDone={this.setVerification} />
        ) : (
          <EmailVerification email={this.state.email} />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (values) => dispatch(action.authSignUp(values)),
  };
};

export default connect(null, mapDispatchToProps)(Register);
