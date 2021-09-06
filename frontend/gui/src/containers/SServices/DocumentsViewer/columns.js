import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const columns = [
	{
		title: "No.",
		dataIndex: "key",
		key: "key",
		width: "5%",
	},

	{
		title: "Nombre del archivo",
		dataIndex: "fullName",
		key: "fullName",
	},
	{
		title: "Operación",
		dataIndex: "download",
		width: "10%",
		key: "download",
		render: (key, record) => {
			return (
				<Button icon={<DownloadOutlined />} shape="round" type="dashed">
					Descargar
				</Button>
			);
		},
	},
];

export default columns;
