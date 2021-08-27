import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button } from "antd";

const datacolumns = [
	{
		title: "Documento",
		dataIndex: "fullName",
		width: "15%",
	},
	{
		title: "Descripción",
		dataIndex: "description",
		width: "40%",
	},
	{
		title: "Estatus",
		dataIndex: "estatus",
	},
	{
		title: "Archivo",
		dataIndex: "archivo",
		render: (text, record) => {
			const uploadProps = {
				action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
				/*onChange: handleChange(record.name),*/
				multiple: false,
			};

			var fileList = null;
			/*if (record.key !== undefined) {
				var file = this.state[record.name];
				fileList = file;
			}*/

			return true ? (
				<Upload {...uploadProps} fileList={fileList}>
					<Button>
						<UploadOutlined /> Elegir archivo
					</Button>
				</Upload>
			) : null;
		},
	},
	/*{
				title: "operation",
				dataIndex: "operation",
				render: (text, record) =>
					this.state.dataSource.length >= 1 ? (
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => this.handleDelete(record.key)}
						>
							<a href="/home/">Delete</a>
						</Popconfirm>
					) : null,
			},*/
];

const columns = datacolumns.map((col) => {
	if (!col.editable) {
		return col;
	}

	return {
		...col,
		onCell: (record) => ({
			record,
			editable: col.editable,
			dataIndex: col.dataIndex,
			title: col.title,
			handleSave: this.handleSave,
		}),
	};
});

export default columns;
