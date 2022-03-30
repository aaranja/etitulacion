import React from "react";
import { Alert, Layout, Space, Typography } from "antd";
import logo from "../../site/img/logotipo.svg";
import UserMenu from "./UserMenu";

const { Header } = Layout;

class NormalHeader extends React.Component {
  render() {
    return (
      <>
        {this.props.authenticated ? (
          <Header
            style={{
              position: "fixed",
              boxShadow: "1px 3px 10px #9E9E9E",
              width: "100%",
              height: "65px",
              zIndex: "999",
              backgroundColor: "#05386B",
            }}
          >
            <div
              style={{
                maxWidth: "1580px",
                margin: "auto",
              }}
            >
              <div className="logo" style={{ float: "left", marginLeft: 0 }}>
                <a href="/home/">
                  <img src={logo} alt={""} width="100%" />
                </a>
              </div>
              <Space
                direction="horizontal"
                style={{
                  float: "right",
                  display: "flex",
                  verticalAlign: "middle",
                  maxWidth: 500,
                  height: "65px",
                }}
              >
                <UserMenu
                  username={this.props.user_name}
                  usertype={this.props.user_type}
                  logout={this.props.logout}
                />
              </Space>
            </div>
          </Header>
        ) : (
          <Header
            style={{
              position: "fixed",
              boxShadow: "1px 3px 10px #9E9E9E",
              width: "100%",
              height: "65px",
              zIndex: "9999",
              backgroundColor: "#05386B",
            }}
          >
            <div
              style={{
                width: this.props.size,
                margin: "auto",
              }}
            >
              <div className="logo" style={{ float: "left" }}>
                <a href="/home/">
                  <img src={logo} alt={""} width="100%" />
                </a>
              </div>
            </div>
          </Header>
        )}
      </>
    );
  }
}

export default NormalHeader;
