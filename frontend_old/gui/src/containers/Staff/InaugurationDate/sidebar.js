import React, { Component } from "react";
import { Card, Divider, Menu, Layout, DatePicker, Button, Space } from "antd";
import {
  CarryOutOutlined,
  FieldTimeOutlined,
  OrderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        zeroWidthTriggerStyle={{ backgroundColor: "grey" }}
        onCollapse={this.onCollapse}
        width={350}
        style={{
          backgroundColor: "white",
          position: "fixed",
          zIndex: "40",
          height: "100%",
        }}
      >
        <Card
          style={{
            borderLeft: 0,
            borderBottom: 0,
            borderTop: 0,
            width: 350,
          }}
        >
          <Divider>Menú</Divider>
          <Menu
            style={{}}
            defaultSelectedKeys={"2"}
            mode="vertical"
            theme="light"
          >
            <Menu.Item
              key="1"
              icon={<OrderedListOutlined />}
              onClick={() => {
                // send keyname to change the current view
                this.props.callBack("list", null);
              }}
            >
              Lista de egresados
            </Menu.Item>
            <Menu.Item key="2" icon={<FieldTimeOutlined />}>
              Fechas de toma de protesta
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<CarryOutOutlined />}
              onClick={() => {
                // send keyname to change the current view
                this.props.callBack("arp", null);
              }}
            >
              Acto de recepción profesional
            </Menu.Item>
          </Menu>
          <Divider>Buscar fecha</Divider>
          <Space direction="vertical">
            <RangePicker />
            <Button block>ARP disponible</Button>
          </Space>

          <Divider />
          <Button block icon={<PlusOutlined />} onClick={this.props.addNewDate}>
            Agregar nueva fecha
          </Button>
        </Card>
      </Sider>
    );
  }
}

export default Sidebar;
