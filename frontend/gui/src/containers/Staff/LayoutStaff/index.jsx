/*
 * Class layout for staff view
 * */
import React, { Component } from "react";
import { Layout } from "antd";

const { Sider } = Layout;
export default class LayoutStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siderprops: {},
      sidebarSize: 350,
    };
  }

  onChildrenMount = (siderprops) => {
    //  set the sider funtion the custom sider
    this.setState({ siderprops: siderprops });
  };

  onCollapse = (collapsed) => {
    let size = 350;
    if (collapsed) size = 0;
    this.setState({
      sidebarSize: size,
    });
  };

  render() {
    let showSider = false;
    if (this.props.siderelement !== null) {
      showSider = true;
    }

    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        {this.props.menu}
        {/*<PageHeader*/}
        {/*  ghost={false}*/}
        {/*  title={this.props.headerName}*/}
        {/*  style={{ height: 50, marginTop: 49, position: "fixed" }}*/}
        {/*/>*/}

        {showSider ? (
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            translate={"yes"}
            width={350}
            zeroWidthTriggerStyle={{
              backgroundColor: "lightgray",
            }}
            onCollapse={this.onCollapse}
            collapsible
            style={{
              backgroundColor: "white",
              position: "fixed",
              zIndex: "40",
              height: "100%",
              marginTop: 70,
            }}
          >
            {React.cloneElement(this.props.siderelement, this.state.siderprops)}
          </Sider>
        ) : null}
        <div
          style={{
            marginLeft: showSider ? this.state.sidebarSize : 0,
            width: "100%",
            height: "100%",
            border: 0,
            backgroundColor: "white",
            paddingLeft: 10,
            paddingRight: 10,
            flex: "1",
            flexDirection: "column",
            marginTop: 70,
          }}
        >
          {React.cloneElement(this.props.children, {
            setSiderProps: this.onChildrenMount,
          })}
        </div>
      </div>
    );
  }
}
