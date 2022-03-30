import React, { Component } from "react";
import { Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

class Verification extends Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography.Title>Verificación de cuenta</Typography.Title>
        <Typography.Paragraph>
          Se está verificando su cuenta, por favor espere.
        </Typography.Paragraph>
        <LoadingOutlined />
      </div>
    );
  }
}

export default Verification;
