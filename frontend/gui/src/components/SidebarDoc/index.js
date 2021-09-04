import React, { Component } from "react";
import {
	Divider,
	Input,
	Card,
	Descriptions,
	Button,
	Space,
	Form,
	List,
} from "antd";
import careerTypes from "../../const/careerTypes";
import { LoadingOutlined } from "@ant-design/icons";

const { TextArea } = Input;

class SidebarDoc extends Component {
	constructor(props) {
		super(props);

		var dataSource = [];
		// if (this.props.loading) {
		// 	var history = this.props.graduate.notifications;
		// 	for (const key in history) {
		// 		var not =
		// 			history[key].date +
		// 			" - " +
		// 			history[key].time +
		// 			"\r| " +
		// 			history[key].message;
		// 		dataSource.unshift(not);
		// 	}
		// }

		this.state = {
			dataSource: dataSource,
			loading: true,
		};
	}

	componentWillUnmount() {
		this.props = null;
		this.setState({
			dataSource: [],
			loading: true,
		});
	}

	componentDidUpdate() {
		var dataSource = this.state.dataSource;
		if (!this.props.loading && this.state.loading) {
			var history = this.props.graduate.notifications;
			for (const key in history) {
				var not =
					history[key].date +
					" - " +
					history[key].time +
					"\r| " +
					history[key].message;
				dataSource.unshift(not);
			}
			this.setState({
				dataSource: dataSource,
				loading: false,
			});
		}
	}

	onApproval = (value, type) => {
		var newDataSource = this.state.dataSource;
		newDataSource.unshift("Ahora: \r" + value);
		this.setState({
			dataSource: newDataSource,
		});

		this.props.onApproval(value, type);
	};

	render() {
		return (
			<Card
				style={{
					overflowY: "scroll",
					position: "fixed",
					display: "flex",
					flexDirection: "column",
					maxHeight: "90vh",
					minWidth: 250,
					width: 300,
					minHeight: "89vh",
					left: 170,
					padding: 0,
					backgroundColor: "white",
				}}
			>
				<Divider orientation="left">Información</Divider>
				{this.props.graduate !== null ? (
					<>
						<Descriptions column={1} style={{ marginLeft: 20 }}>
							<Descriptions.Item label="Matrícula">
								{this.props.graduate.enrollment}
							</Descriptions.Item>
							<Descriptions.Item label="Nombre">
								{this.props.graduate.first_name}
							</Descriptions.Item>
							<Descriptions.Item label="Apellidos">
								{this.props.graduate.last_name}
							</Descriptions.Item>
							<Descriptions.Item label="Carrera">
								{careerTypes[this.props.graduate.career]}
							</Descriptions.Item>
							<Descriptions.Item label="Status">
								{this.props.graduate.status}
							</Descriptions.Item>
							<Descriptions.Item label="Estatus documentación">
								{this.props.graduate.accurate_docs}
							</Descriptions.Item>
						</Descriptions>
						<Divider orientation="left">Validación</Divider>
						<Form
							name="approval"
							onFinish={(values) => {
								this.onApproval(values.comment, "error");
							}}
						>
							<Space
								direction="vertical"
								style={{ width: "100%" }}
							>
								<Form.Item name="comment" key={1}>
									<TextArea rows={6} />
								</Form.Item>
								<Space
									direction="horizontal"
									style={{
										width: "100%",
										justifyContent: "center",
									}}
								>
									<Button
										danger
										htmlType="submit"
										form="approval"
									>
										Notificar
									</Button>
									<Button
										type="primary"
										onClick={() =>
											this.onApproval(
												"Documentación aprobada",
												"success"
											)
										}
									>
										Aprobar
									</Button>
								</Space>
							</Space>
						</Form>
						<Divider orientation="left">Historial</Divider>
						<List
							size="small"
							bordered
							dataSource={this.state.dataSource}
							renderItem={(item) => <List.Item>{item}</List.Item>}
						/>
					</>
				) : (
					<LoadingOutlined />
				)}
			</Card>
		);
	}
}

export default SidebarDoc;
