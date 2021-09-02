import React, { Component } from "react";
import { Divider, Input, Card, Descriptions, Button, Space } from "antd";
import careerTypes from "../../const/careerTypes";
const { Search } = Input;
const { TextArea } = Input;

class SidebarDoc extends Component {
	render() {
		return (
			<Card
				style={{
					overflow: "auto",
					position: "fixed",
					display: "flex",
					flexDirection: "column",
					minWidth: 250,
					width: 260,
					minHeight: "89vh",
					left: 170,
					padding: 0,
					backgroundColor: "white",
				}}
			>
				<Divider orientation="left">Información</Divider>
				<Descriptions column={1} style={{ marginLeft: 20 }}>
					<Descriptions.Item label="Matrícula">
						{this.props.info.enrollment}
					</Descriptions.Item>
					<Descriptions.Item label="Nombre">
						{this.props.info.first_name}
					</Descriptions.Item>
					<Descriptions.Item label="Apellidos">
						{this.props.info.last_name}
					</Descriptions.Item>
					<Descriptions.Item label="Carrera">
						{careerTypes[this.props.info.career]}
					</Descriptions.Item>
					<Descriptions.Item label="Status">
						{this.props.info.status}
					</Descriptions.Item>
					<Descriptions.Item label="Estatus documentación">
						{this.props.info.accurate_docs}
					</Descriptions.Item>
				</Descriptions>
				<Divider orientation="left">Validación</Divider>
				<Space direction="vertical" style={{ width: "100%" }}>
					<TextArea rows={6} />
					<Space
						direction="horizontal"
						style={{
							width: "100%",
							justifyContent: "center",
						}}
					>
						<Button danger>Notificar</Button>
						<Button type="primary">Aprobar</Button>
					</Space>
				</Space>
			</Card>
		);
	}
}

export default SidebarDoc;
