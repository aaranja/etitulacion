import React, { Component } from "react";
import { Button } from "antd";

export default class SiderTest extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.on}>HOla</Button>
      </div>
    );
  }
}
