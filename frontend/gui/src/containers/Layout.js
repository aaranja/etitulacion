import React from "react";
import { Layout, Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import * as action from "../store/actions/auth";
import { connect } from "react-redux";
import "../css/layout.css";
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;

class SiderDemo extends React.Component {
  /*constructor(props) {
    super(props);
    //var token = localStorage.getItem("token");
    //console.log("token")
  }*/

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    //console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    //console.log("logeado: ".concat(this.props.isAuthenticated));

    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <a href="/home/">
              <span style={{ color: "#FF6363" }}>e</span>Titulación
            </a>
          </div>
          <Menu theme="dark" mode="horizontal" className="rightMenu">
            {this.props.isAuthenticated ? (
              <SubMenu
                style={{ float: "right" }}
                key="1"
                title={
                  <span>
                    <UserOutlined />
                    {localStorage.getItem("all_name")}
                  </span>
                }
              >
                <Menu.Item key="setting:1">
                  <span>
                    <ProfileOutlined />
                    <Link to="/account/">Datos personales</Link>
                  </span>
                </Menu.Item>
                <Menu.Item key="setting:2" onClick={this.props.logout}>
                  <span>
                    <LogoutOutlined />
                    Cerrar sesión
                  </span>
                </Menu.Item>
              </SubMenu>
            ) : (
              <Menu
                theme="dark"
                style={{ float: "right" }}
                mode="horizontal"
                className="rightMenu"
              >
                <Menu.Item key="1">
                  <Link to="/signup/">Registro</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/login/">Iniciar sesión</Link>
                </Menu.Item>
              </Menu>
            )}
          </Menu>
        </Header>
        <Content style={{ padding: "30px 50px" }}>
          <div className="site-layout-content">{this.props.children}</div>
        </Content>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(action.logout()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SiderDemo));
