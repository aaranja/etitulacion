// class to register a new graduate user
// https://colorhunt.co/palette/0820322c394b334756ff4c29
import React from "react";
import { Form, Input, Button, Select, Card, Typography, Space } from "antd";
import * as action from "../../store/actions/auth";
import * as itemLayout from "./ItemLayout";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
const { Title } = Typography;
const { Option } = Select;
class Register extends React.Component {
	onFinish = (values) => {
		console.log("Receive values of form: ", values);
		this.props.onAuth(
			values.email,
			values.first_name,
			values.last_name,
			values.password1,
			values.password2,
			values.enrollment,
			values.career,
			values.gender
		);
	};

	componentDidUpdate() {
		if (!this.props.loading) {
			//when the loading is finish
			if (this.props.error != null) {
				this.openNotification();
			} else {
				// without erros -> go to home
				this.props.history.push("/home/");
			}
		}
	}

	render() {
		return (
			<div
				className="contenedor card"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: "5vh",
				}}
			>
				<Card
					title={
						<Title level={3} style={{ color: "white" }}>
							Formulario de registro
						</Title>
					}
					bordered={false}
					style={{
						width: 500,
						alignSelf: "center",
						textAlign: "center",
						/*fontWeight: "bold",*/
						boxShadow: "1px 3px 1px #9E9E9E",
						borderRadius: 5 + "px",
					}}
					headStyle={{
						backgroundColor: "#082032",
						borderTopLeftRadius: "5px",
						borderTopRightRadius: "5px",
					}}
				>
					<Form
						{...itemLayout.form}
						name="register"
						initialValues={{ layout: "horizontal" }}
						scrollToFirstError
						onFinish={(values) => this.onFinish(values)}
					>
						<Form.Item
							name="first_name"
							label="Nombre"
							rules={[
								{
									required: true,
									message: "Por favor introduce tu nombre!",
								},
							]}
						>
							<Input placeholder="Nombre" />
						</Form.Item>

						<Form.Item
							name="last_name"
							label="Apellidos"
							rules={[
								{
									required: true,
									message: "Por favor introduce tu nombre!",
								},
							]}
						>
							<Input placeholder="Apellidos" />
						</Form.Item>

						<Form.Item
							name="enrollment"
							label="Matrícula"
							rules={[
								{
									required: true,
									message:
										"Por favor introduce tu matrícula!",
								},
							]}
						>
							<Input
								placeholder="No. control"
								maxLength="8"
								onKeyPress={(event) => {
									if (!/[0-9]/.test(event.key)) {
										event.preventDefault();
									}
								}}
							/>
						</Form.Item>
						<Form.Item
							label="Carrera"
							name="career"
							rules={[
								{
									required: true,
									message: "Por favor seleccione su carrera!",
								},
							]}
						>
							<Select placeholder="Seleccione su carrera">
								<Select.Option value="sistemas">
									Ing. Sistemas
								</Select.Option>
								<Select.Option value="mecatronica">
									Ing. Mecatrónica
								</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item
							label="Género"
							name="gender"
							rules={[
								{
									required: true,
									message: "Por favor seleccione una opción!",
								},
							]}
						>
							<Select placeholder="Seleccione su género">
								<Option value="fem">Femenino</Option>
								<Option value="mas">Masculino</Option>
								<Option value="ind">Otro</Option>
							</Select>
						</Form.Item>

						<Form.Item
							name="email"
							label="E-mail"
							rules={[
								{
									type: "email",
									message: "E-mail no válido!",
								},
								{
									required: true,
									message: "Por favor introduce tu E-mail!",
								},
							]}
						>
							<Input placeholder="Correo eléctronico" />
						</Form.Item>

						<Form.Item
							name="password1"
							label="Contraseña"
							rules={[
								{
									required: true,
									message:
										"Por favor introduce tu contraseña!",
								},
							]}
							hasFeedback
						>
							<Input.Password placeholder="Contraseña" />
						</Form.Item>

						<Form.Item
							name="password2"
							label="Confirmar contraseña"
							dependencies={["password1"]}
							hasFeedback
							rules={[
								{
									required: true,
									message:
										"Por favor confirma tu contraseña!",
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (
											!value ||
											getFieldValue("password1") === value
										) {
											return Promise.resolve();
										}

										return Promise.reject(
											"Las contraseñas no coinciden!"
										);
									},
								}),
							]}
						>
							<Input.Password placeholder="Confirmar contraseña" />
						</Form.Item>

						<Form.Item {...itemLayout.tail}>
							<Space>
								<Button
									type="link"
									icon={<ArrowLeftOutlined />}
									href="/login/"
								>
									Iniciar sesión
								</Button>
								<Button type="primary" htmlType="submit">
									Registrar
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Card>
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
		onAuth: (
			email,
			first_name,
			last_name,
			password1,
			password2,
			enrollment,
			career,
			gender
		) =>
			dispatch(
				action.authSignUp(
					email,
					first_name,
					last_name,
					password1,
					password2,
					enrollment,
					career,
					gender
				)
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
