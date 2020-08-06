import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import ValidateInfo from "./steps/ValidateInfo";
import UploadDocs from "./steps/UploadDocs";

import { Layout, Menu } from "antd";
import { MailOutlined, CalendarOutlined } from "@ant-design/icons";
import "../css/home.css";
import "antd/dist/antd.css";
const { Content, Sider } = Layout;

class Home extends React.Component {
  // load data from server if toke is in storage
  constructor(props) {
    super(props);
    var token = localStorage.getItem("token");
    //console.log(token)
    if (localStorage.getItem("token") === null) {
      this.props.history.push("/login/");
    } else {
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      axios.get("http://127.0.0.1:8000/api/").then((rest) => {
        this.setState({
          accounts: rest.data,
        });
        //console.log(rest.data[0]);
        // save name in localstorage to display on header
        localStorage.setItem(
          "all_name",
          rest.data[0]["first_name"] + " " + rest.data[0]["last_name"]
        );
      });
    }
  }

  getChildState = (step) => {
    console.log(step);
    this.setState({ step: step });
  };

  // redirect to Login if props.token is changed
  UNSAFE_componentWillReceiveProps(newProps) {
    console.log("recarga");
    if (newProps.token === null) this.props.history.push("/login/");
  }

  state = {
    step: "1",
  };

  view_info = (collapsed) => {
    this.setState({ step: "1" });
    console.log(this.state.step);
  };

  view_docs = (comp) => {
    this.setState({ step: "2" });
    console.log(this.state.step);
  };

  render() {
    return (
      <Content style={{ padding: "0 0px" }}>
        <Layout
          className="site-layout-background"
          style={{ padding: "24px 0" }}
        >
          <Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              selectedKeys={[this.state.step]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%" }}
            >
              <Menu.Item
                key="1"
                icon={<MailOutlined />}
                onClick={this.view_info}
              >
                Verificar información
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<CalendarOutlined />}
                onClick={this.view_docs}
                disabled={true}
              >
                Subir documentación
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            {this.state.step === "1" ? (
              <ValidateInfo callbackFromParent={this.getChildState} />
            ) : (
              <UploadDocs />
            )}
          </Content>
        </Layout>
      </Content>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Home);
