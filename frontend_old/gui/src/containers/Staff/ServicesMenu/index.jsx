import React, { Component } from "react";
import { Menu } from "antd";
import { CarryOutOutlined, OrderedListOutlined } from "@ant-design/icons";

export default class ServicesMenu extends Component {
  render() {
    return (
      <>
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
            key="aeprofesional"
            icon={<CarryOutOutlined />}
            onClick={() => {
              // send keyname to change the current view
              this.props.menuAction("aeprofesional");
            }}
          >
            Acta de examen profesional
          </Menu.Item>
        </Menu>
      </>
    );
  }
}
