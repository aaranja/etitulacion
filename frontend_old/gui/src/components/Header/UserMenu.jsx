import React, { Component } from "react";
import { Button, Drawer, Menu } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

export default class UserMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sideMenu: false,
    };
  }

  closeMenu = () => {
    this.setState({
      sideMenu: false,
    });
  };

  openMenu = () => {
    this.setState({
      sideMenu: true,
    });
  };

  render() {
    const conf_links = {
      USER_GRADUATE: "/home/graduate/settings/",
      USER_COORDINAT: "/home/coordination/settings/",
      USER_SERVICES: "/home/services/settings/",
      USER_ADMIN: "/home/services/settings/",
    };
    let { sideMenu } = this.state;
    const { username, logout, usertype } = this.props;
    return (
      <>
        <Menu
          mode="horizontal"
          className="rightMenu"
          key="10"
          disabledOverflow={true}
          style={{
            backgroundColor: "#05386B",
          }}
        >
          <SubMenu
            key="1"
            className="rightMenu"
            style={{
              justifyContent: "center",
            }}
            title={
              <p style={{ margin: "auto", color: "white" }}>
                <UserOutlined /> &nbsp;
                {username}
              </p>
            }
          >
            <Menu.Item key="2">
              <Link to={conf_links[usertype]}>
                <SettingOutlined />
                &nbsp; Configuración
              </Link>
            </Menu.Item>
            <Menu.Item key="3" onClick={logout}>
              <LogoutOutlined />
              &nbsp; Cerrar sesión
            </Menu.Item>
          </SubMenu>
        </Menu>
        <div className="menuSideButton">
          <Button icon={<MenuOutlined />} onClick={this.openMenu} />
        </div>
        <Drawer
          visible={sideMenu}
          closable={true}
          onClose={this.closeMenu}
          width={250}
        ></Drawer>
      </>
    );
  }
}
