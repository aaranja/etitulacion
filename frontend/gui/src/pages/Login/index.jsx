import React from "react";
import { Form, Input, Button, Spin, Card, notification } from "antd";
import {
	UserOutlined,
	LockOutlined,
	LoadingOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as action from "../../store/actions/auth";
import "../../css/login.css";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class Login extends React.Component {
	/*Send login data to store auth actions*/
	onFinish = (values) => {
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
				"El correo o contraseña son inválidos, por favor introduzcalos correctamente",
			icon: <SmileOutlined style={{ color: "#108ee9" }} />,
		});
	};

	UNSAFE_componentWillReceiveProps(newProps) {
		//console.log(localStorage.getItem('token'))
		if (!newProps.loading)
			if (newProps.token !== null) this.props.history.push("/home/");
	}

	componentDidUpdate() {
		if (this.props.error != null) {
			this.openNotification();
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
				}}
			>
				{this.props.loading ? (
					<Spin indicator={antIcon} />
				) : (
					<Card
						title="Iniciar sesión en etitulación"
						bordered={false}
						style={{ width: 300, alignSelf: "center" }}
					>
						<Form
							name="normal_login"
							className="login-form"
							initialValues={{
								remember: true,
							}}
							onFinish={this.onFinish}
						>
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
								O
								<NavLink
									to="/signup/"
									style={{ marginLeft: 20 }}
								>
									Registrate
								</NavLink>
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
		loading: state.loading,
		error: state.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password) =>
			dispatch(action.authLogin(email, password)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
