import React, { Component } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

class UploadPDF extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fileList: {
				key: 1,
				keyName: "ACTA",
				status: "done",
				url: "http://www.baidu.com/xxx.png",
			},
			count: 1,
		};

		this.props = {
			beforeUpload: (file) => {
				if (file.type !== "pdf") {
					message.error(`${file.name} no es un archivo PDF!`);
				}
				return file.type === "pdf" ? true : Upload.LIST_IGNORE;
			},

			onChange: (info) => {
				console.log(info.fileList);
			},
		};
	}

	render() {
		return (
			<Upload {...this.props} fileList={this.fileList}>
				<Button>
					<UploadOutlined /> Elegir archivo
				</Button>
			</Upload>
		);
	}
}

export default UploadPDF;
