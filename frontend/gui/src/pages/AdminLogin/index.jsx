import React, { Component } from "react";
import {
	Form,
	Input,
	Button,
	Spin,
	Card,
	notification,
	Typography,
} from "antd";

import {
	UserOutlined,
	LockOutlined,
	LoadingOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import * as action from "../../store/actions/auth";
import "../../css/login.css";
import Image from "../../img/logo.png";
const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class AdminLogin extends Component {
	onFinish = (values) => {
		console.log("inciando el login");
		this.props.onAuth(values.email, values.password);
	};

	rules = (textString) => {
		return [
			{
				required: true,
				message: "Por favor introduce tu " + textString + "!",
			},
		];
	};

	openNotification = () => {
		notification.open({
			message: "Error de inicio de sesión",
			description:
				"El correo o contraseña son inválidos, por favor introduzcalos correcamente",
			icon: <SmileOutlined style={{ color: "#108ee9" }} />,
		});
	};

	componentDidUpdate() {
		if (!this.props.loading) {
			//when isn't loading the loggin
			if (this.props.error != null) {
				this.openNotification();
			} else {
				// without erros -> go to home
				this.props.history.push("/admin/panel");
			}
		}
	}

	render() {
		const email = "Correo electrónico";
		const password = "Contraseña";

		return (
			<div
				className="contenedor card"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: "10vh",
				}}
			>
				{this.props.loading ? (
					<Spin indicator={antIcon} />
				) : (
					<Card
						title={
							<React.Fragment>
								<Title level={3}>Admin site</Title>
								<img
									src={Image}
									style={{ width: "100%" }}
									alt=" "
								/>
							</React.Fragment>
						}
						bordered={false}
						style={{
							width: 300,
							alignSelf: "center",
							fontSize: "20",
							textAlign: "center",
							fontWeight: "bold",
							boxShadow: "1px 3px 1px #9E9E9E",
						}}
					>
						<Form
							name="normal_login"
							className="login-form"
							initialValues={{
								remember: true,
							}}
							onFinish={this.onFinish}
						>
							<Title level={4} style={{ marginBottom: "20px" }}>
								Iniciar sesión
							</Title>
							<Form.Item name="email" rules={this.rules(email)}>
								<Input
									prefix={
										<UserOutlined className="site-form-item-icon" />
									}
									placeholder="Correo electrónico"
								/>
							</Form.Item>
							<Form.Item
								name="password"
								rules={this.rules(password)}
							>
								<Input
									prefix={
										<LockOutlined className="site-form-item-icon" />
									}
									type="password"
									placeholder="Password"
								/>
							</Form.Item>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="login-form-button"
									style={{ marginRight: 20 }}
								>
									Iniciar Sesión
								</Button>
							</Form.Item>
						</Form>
					</Card>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password) =>
			dispatch(action.authLogin(email, password)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin);
