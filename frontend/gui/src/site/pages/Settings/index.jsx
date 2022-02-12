import React, { Component } from "react";
import { Menu, Layout } from "antd";
import {
  BorderOutlined,
  KeyOutlined,
  ProfileOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Signature from "../../../containers/Staff/Settings/Services/Signature";
import AccountDetails from "../../../containers/Staff/Settings/Services/AccountDetails";

const { SubMenu } = Menu;
const { Content } = Layout;

class SettingsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 1,
    };
  }
  setNewCurrentView = (key) => {
    this.setState({
      currentView: key,
    });
  };

  render() {
    const getCurrentView = () => {
      switch (this.state.currentView) {
        case 1:
          return <AccountDetails />;
        case 2:
          return <Signature />;
        case 3:
          return null;
        default:
          return null;
      }
    };

    return (
      <div style={{ height: "70vh", display: "flex" }}>
        <Menu
          style={{ width: 350, height: "70vh", paddingTop: 50 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="light"
        >
          <Menu.Item
            key="1"
            icon={<ProfileOutlined />}
            onClick={() => {
              this.setNewCurrentView(1);
            }}
          >
            Datos personales
          </Menu.Item>

          <SubMenu key="sub1" icon={<SettingOutlined />} title="Configuración">
            <Menu.Item
              icon={<BorderOutlined />}
              key="3"
              onClick={() => {
                this.setNewCurrentView(2);
              }}
            >
              Firma electrónica
            </Menu.Item>
            <Menu.Item
              icon={<KeyOutlined />}
              key="4"
              onClick={() => {
                this.setNewCurrentView(3);
              }}
            >
              Contraseña
            </Menu.Item>
          </SubMenu>
        </Menu>
        <Content
          style={{
            backgroundColor: "white",
            marginLeft: "10px",
            width: "70vw",
            paddingTop: 30,
          }}
        >
          {getCurrentView()}
        </Content>
      </div>
    );
  }
}
export default SettingsPanel;
