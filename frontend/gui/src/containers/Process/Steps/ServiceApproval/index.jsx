import React, { Component } from "react";
import {
	PageHeader,
	Button,
	Descriptions,
	Divider,
	Tag,
	notification,
	Popconfirm,
} from "antd";
import * as actions from "../../../../store/actions/process";
import {
	ArrowRightOutlined,
	DeliveredProcedureOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";

class ServiceApproval extends Component {
	constructor(props) {
		super(props);
		var len = props.status.notifications.length;
		var notification = null;

		if (len > 0) {
			notification = props.status.notifications[len - 1];
		}

		this.state = {
			notification: notification,
		};
	}

	onBack = () => {
		if (this.props.status.codeStatus === "STATUS_05") {
			notification["error"]({
				message: "Operación no permitida",
				description: "Para ir para atrás cancele el proceso actual.",
			});
		} else {
			this.props.callbackFromParent(1);
		}
	};

	onNextProcess = () => {};

	updateStatus = () => {
		this.props.getApprovalStatus();
	};

	sendStatus = (status) => {
		this.props.setNewStatus(status);
	};

	render() {
		// function to set the tag of approval status
		const approvalStatus = () => {
			var text = null;

			switch (this.props.status.codeStatus) {
				case "STATUS_06":
					text = "Documentación aprobada";
					break;
				case "STATUS_05":
					text = "En proceso de revisión";
					break;
				case "STATUS_04":
					text = "Documentación rechazada";
					break;
				case "STATUS_03":
					text = "En espera";
					break;
				default:
					text = null;
					break;
			}

			return <Tag color={this.props.status.statusType}>{text}</Tag>;
		};

		const initValidation = () => {
			var text = null;
			var color = "default";
			var icon = null;
			var newStatus = null;
			switch (this.props.status.codeStatus) {
				case "STATUS_06":
					return null;
				case "STATUS_05":
					text = "Cancelar";
					color = "error";
					icon = <CloseCircleOutlined />;
					newStatus = "STATUS_03";
					break;
				case "STATUS_04":
					return (
						<Popconfirm
							placement="top"
							title={"¿Has cambiado los documentos incorrectos?"}
							onConfirm={() => this.sendStatus("STATUS_05")}
							okText="Si"
							cancelText="No"
						>
							<Button icon={<DeliveredProcedureOutlined />}>
								Reenviar documentos
							</Button>
						</Popconfirm>
					);
				case "STATUS_03":
					text = "Enviar";
					color = "default";
					icon = <DeliveredProcedureOutlined />;
					newStatus = "STATUS_05";
					break;
				default:
					return null;
			}

			return (
				<Button
					type={color}
					icon={icon}
					onClick={() => this.sendStatus(newStatus)}
				>
					{text}
				</Button>
			);
		};

		// function to set abled or disabled to cdni download
		const abledToDownload = () => {
			if (this.props.status.statusType === "success") {
				return <Button type="primary">Descargar</Button>;
			}

			return (
				<Button type="primary" disabled>
					No disponible
				</Button>
			);
		};

		const contentStyle = {
			display: "flex",
			maxWidth: "400px",
			minWidth: "100px",
			justifyContent: "center",
		};

		return (
			<div>
				<PageHeader
					ghost={false}
					onBack={() => this.onBack()}
					title="Aprobación de documentos por el departamento de servicios escolares"
					extra={[
						<Button
							key="1"
							type="primary"
							onClick={() => this.onNextProcess()}
						>
							Siguiente <ArrowRightOutlined />
						</Button>,
					]}
				>
					<Descriptions size="middle" column={1}>
						<Descriptions.Item label={<b>INSTRUCCIONES</b>}>
							Si todo está listo, haz click en el botón "enviar".
							Esto hará que tu documentación entre al proceso de
							validación por parte del departamento de servicios
							escolares.
						</Descriptions.Item>
						<Descriptions.Item>
							Una vez que tu documentación sea aprobada, podrás
							descargar la constancia de no inconvenientes
							(requerido para la aprobación de coordinación de
							titulación*).
						</Descriptions.Item>
					</Descriptions>
				</PageHeader>
				<Divider orientation="center">Aprobación</Divider>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Descriptions
						column={1}
						bordered={true}
						layout="horizontal"
						extra={
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								{initValidation()}
							</div>
						}
					>
						<Descriptions.Item label="Estado">
							<div style={contentStyle}>{approvalStatus()}</div>
						</Descriptions.Item>
						<Descriptions.Item label="Información">
							<div style={contentStyle}>
								{this.props.status.message}
							</div>
						</Descriptions.Item>
						{this.state.notification !== null ? (
							<Descriptions.Item label="Notificación">
								<div style={contentStyle}>
									{this.state.notification.message}
								</div>
							</Descriptions.Item>
						) : null}
						<Descriptions.Item label="Constancia de no inconvenientes">
							<div style={contentStyle}>{abledToDownload()}</div>
						</Descriptions.Item>
					</Descriptions>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getApprovalStatus: () => dispatch(actions.getStatus()),
		setNewStatus: (status) => dispatch(actions.setNewStatus(status)),
	};
};

export default connect(null, mapDispatchToProps)(ServiceApproval);
