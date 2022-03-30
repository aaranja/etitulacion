import React, { Component } from "react";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import SystemInformation from "../../../containers/Admin/SiteInformation";
import Accounts from "../../../containers/Admin/Accounts";

const { SubMenu } = Menu;
const { Content } = Layout;

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 2,
    };
  }

  setNewCurrentView = (key) => {
    this.setState({
      currentView: key,
    });
  };

  render() {
    const getCurrentView = (key) => {
      switch (key) {
        case 1:
          return <SystemInformation />;
        case 2:
          return <Accounts key="services" type="services" />;
        case 3:
          return <Accounts key="coordination" type="coordination" />;
        case 4:
          return <Accounts key="graduates" type="graduates" />;
        default:
          return null;
      }
    };

    return (
      <div
        style={{
          marginTop: "5vh",
          display: "flex",
        }}
      >
        <Menu
          style={{ width: 256, height: "70vh" }}
          defaultSelectedKeys={["3"]}
          defaultOpenKeys={["sub1", "sub2"]}
          mode="inline"
          theme="light"
        >
          <SubMenu
            key="sub1"
            icon={<SettingOutlined />}
            title={"Configuración"}
          >
            <Menu.Item
              key="1"
              onClick={() => {
                this.setNewCurrentView(1);
              }}
            >
              Datos del Instituto
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => {
                this.setNewCurrentView(1);
              }}
            >
              CNI
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Cuentas">
            <Menu.Item
              key="3"
              onClick={() => {
                this.setNewCurrentView(2);
              }}
            >
              Servicios Escolares
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => {
                this.setNewCurrentView(3);
              }}
            >
              Coordinación de Titulación
            </Menu.Item>
            <Menu.Item
              key="5"
              onClick={() => {
                this.setNewCurrentView(4);
              }}
            >
              Egresados
            </Menu.Item>
          </SubMenu>
        </Menu>

        <Content
          style={{
            backgroundColor: "white",
            marginLeft: "10px",
          }}
        >
          {getCurrentView(this.state.currentView)}
        </Content>
      </div>
    );
  }
}

export default AdminPanel;
