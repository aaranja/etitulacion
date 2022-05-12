import React, { Component } from "react";
import { Divider, DatePicker, Card, Button } from "antd";

const { RangePicker } = DatePicker;

class ARPSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <Card
        style={{
          border: 0,
          width: 350,
          flexDirection: "column",
          minWidth: 350,
        }}
      >
        <Divider style={{ marginTop: 0 }}>Buscar fecha</Divider>
        <RangePicker />
        <Divider />
        <Button block onClick={this.props.addARPStaff}>
          Personal ARP
        </Button>
      </Card>
    );
  }
}

export default ARPSidebar;
