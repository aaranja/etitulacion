import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "../css/login.css";

const { Content } = Layout;

class Cover extends React.Component {
  // load data from server if toke is in storage
  constructor(props) {
    super(props);
    console.log("holowis");
    if (localStorage.getItem("token") !== null) {
      this.props.history.push("/home/");
    }
  }
  // redirect to Login if props.token is changed
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.token !== null) this.props.history.push("/home/");
  }

  render() {
    return (
      <Content>
        <div className="site-layout-content">Content</div>
      </Content>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Cover);
