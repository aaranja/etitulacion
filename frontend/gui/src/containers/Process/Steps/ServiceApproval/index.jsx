import React, { Component } from "react";
import { PageHeader, Button, Descriptions, Divider, Tag } from "antd";
import * as actions from "../../../../store/actions/process";
import { ArrowRightOutlined, ReloadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

class ServiceApproval extends Component {
	componentDidMount() {}

	onNextProcess = () => {};

	updateStatus = () => {
		this.props.getApprovalStatus();
	};

	render() {
		// function to set the tag of approval status
		const approvalStatus = () => {
			var text = null;

			switch (this.props.status.codeStatus) {
				case "STATUS_06":
					text = "Aprobado";
					break;
				case "STATUS_05":
					text = "En proceso";
					break;
				case "STATUS_04":
					text = "Error";
					break;
				default:
					text = null;
					break;
			}

			return <Tag color={this.props.status.statusType}>{text}</Tag>;
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
					onBack={() => this.props.callbackFromParent(1)}
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
							El departamento de servicios escolares está
							procesando tu documentación.
						</Descriptions.Item>
						<Descriptions.Item>
							Una vez que tu documentación sea aprobada, podrás
							descargar la
							<p>&nbsp;constancia de no inconvenientes&nbsp;</p>
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
								<Button type="link">Actualizar</Button>
								<Button
									type="primary"
									shape="circle"
									icon={<ReloadOutlined />}
									label="hoal"
									onClick={this.updateStatus}
								></Button>
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
						{this.props.status.statusType === "error" ? (
							<Descriptions.Item label="Comentarios">
								<div style={contentStyle}>
									Por el momento esto está vacío
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
	};
};

export default connect(null, mapDispatchToProps)(ServiceApproval);
