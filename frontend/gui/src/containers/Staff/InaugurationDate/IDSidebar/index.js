import React, { Component } from "react";
import { Button, Card, DatePicker, Divider, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
export default class IDSidebar extends Component {
  render() {
    return (
      <Card
        style={{
          borderLeft: 0,
          borderBottom: 0,
          borderTop: 0,
          flexDirection: "column",
          width: 350,
          minWidth: 350,
        }}
      >
        <Divider style={{ marginTop: 0 }}>Buscar fecha</Divider>
        <Space direction="vertical">
          <RangePicker />
          <Button block>ARP disponible</Button>
        </Space>

        <Divider />
        <Button block icon={<PlusOutlined />} onClick={this.props.addNewDate}>
          Agregar nueva fecha
        </Button>
      </Card>
    );
  }
}
