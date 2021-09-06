import React from "react";
import { Progress, Tag } from "antd";

const datacolumns = [
	{
		title: "No. control",
		dataIndex: "enrollment",
		width: "10%",
	},
	{
		title: "Nombre",
		dataIndex: "first_name",
		width: "20%",
	},
	{
		title: "Apellidos",
		dataIndex: "last_name",
		width: "30%",
	},
	{
		title: "Carrera",
		dataIndex: "career",
		width: "20%",
	},
	{
		title: "Estatus",
		dataIndex: "status",
		width: "10%",
		render: (text, record) => {
			var current = 0;
			switch (text) {
				case "STATUS_00":
					current = 0;
					break;
				case "STATUS_01":
					current = 1;
					break;
				case "STATUS_02":
					current = 2;
					break;
				case "STATUS_03":
					current = 2;
					break;
				case "STATUS_04":
					current = 2;
					break;
				case "STATUS_05":
					current = 3;
					break;
				case "STATUS_06":
					current = 4;
					break;
				default:
					current = 4;
			}
			return <Progress percent={current * 25} steps={4} />;
		},
	},
	{
		title: "Documentación",
		dataIndex: "documents",
		width: "10%",
		render: (text, record) => {
			var color = "default";
			var custom_text = "Sin cargar";
			var status = record.status;
			if (status === "STATUS_06") {
				color = "success";
				custom_text = "Aprobada";
			} else {
				if (status === "STATUS_05") {
					color = "processing";
					custom_text = "Por revisar";
				} else {
					if (status === "STATUS_04") {
						color = "error";
						custom_text = "Rechazada";
					}
				}
			}

			return (
				<Tag
					color={color}
					style={{ width: "100%", textAlign: "center" }}
				>
					{custom_text}
				</Tag>
			);
		},
	},
];

export const columns = datacolumns.map((col) => {
	return col;
});

export default columns;
