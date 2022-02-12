import React, { Component } from "react";
import { Menu } from "antd";
import {
  CarryOutOutlined,
  FieldTimeOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

export default class CoordinationMenu extends Component {
  render() {
    return (
      <Menu
        style={{
          backgroundColor: "white",
          height: 50,
          position: "fixed",
          zIndex: "40",
          width: "70vw",
        }}
        selectedKeys={[this.props.selected]}
        mode="horizontal"
        theme="light"
      >
        <Menu.Item
          key="list"
          icon={<OrderedListOutlined />}
          onClick={() => {
            this.props.menuAction("list");
          }}
        >
          Lista de egresados
        </Menu.Item>
        <Menu.Item
          key="inauguration"
          icon={<FieldTimeOutlined />}
          onClick={() => {
            // send keyname to change the current view
            this.props.menuAction("inauguration");
          }}
        >
          Fechas de toma de protesta
        </Menu.Item>
        <Menu.Item
          key="arp"
          icon={<CarryOutOutlined />}
          onClick={() => {
            // send keyname to change the current view
            this.props.menuAction("arp");
          }}
        >
          Acto de recepción profesional
        </Menu.Item>
      </Menu>
    );
  }
}
