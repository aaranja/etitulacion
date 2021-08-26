import React, { Component } from "react";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

class UploadFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
		};
	}

	render() {
		return (
			<Upload {...uploadProps} fileList={fileList}>
				<Button>
					<UploadOutlined /> Elegir archivo
				</Button>
			</Upload>
		);
	}
}

export default UploadFile;
