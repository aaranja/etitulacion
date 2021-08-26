import React, { Component } from "react";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as newProps from "./testProps.js";

class UploadFileTable extends Component {
	constructor(props) {
		super(props);
		console.log(newProps.dataSource);
		this.state = newProps.dataSource;
	}

	render() {
		return <div></div>;
	}
}

export default UploadFileTable;
