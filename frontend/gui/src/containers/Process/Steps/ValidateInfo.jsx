import React, { Fragment } from "react";
import { Divider, Form, Input, Button, Select, Card } from "antd";
import "antd/dist/antd.css";
import * as actions from "../../../store/actions/account";
import { connect } from "react-redux";

class ValidateInfo extends React.Component {
	componentDidMount() {}

	componentDidUpdate() {
		if (!this.props.account.loading) {
			//when isn't loading the loggin
			if (this.props.account.error != null) {
				console.log("error");
			} else {
				console.log("se han cargado los datos del usuario");
			}
		}
	}

	onFinish = (values, oldValues) => {
		/*Send data updated to store account actions*/
		if (values.first_name === undefined)
			values.first_name = oldValues.first_name;
		if (values.last_name === undefined)
			values.last_name = oldValues.last_name;
		if (values.enrollment === undefined)
			values.enrollment = oldValues.enrollment;
		if (values.career === undefined) values.career = oldValues.career;
		if (values.gender === undefined) values.gender = oldValues.gender;

		/*this.props.callbackFromParent(1);*/
		this.props.onUpdate(
			values.first_name,
			values.last_name,
			values.enrollment,
			values.career,
			values.gender,
			this.props.account.payload.titulation_type
		);
	};

	render() {
		const dataValues = (data) => {
			/*Need receive props.data to return main profile data*/
			return {
				// eslint-disable-next-line
				["first_name"]: data.account.first_name,
				// eslint-disable-next-line
				["last_name"]: data.account.last_name,
				// eslint-disable-next-line
				["enrollment"]: data.enrollment,
				// eslint-disable-next-line
				["career"]: data.career,
				// eslint-disable-next-line
				["gender"]: data.gender,
			};
		};

		const layout = {
			labelCol: {
				span: 8,
			},
			wrapperCol: {
				span: 1,
			},
		};

		let lastIndex = 0;
		const updateIndex = () => {
			lastIndex++;
			return lastIndex;
		};

		return (
			<div>
				<Divider orientation="center">Información personal</Divider>
				{this.props.account.payload !== null &&
				this.props.loading === false ? (
					<Fragment>
						<p>
							Verifique que toda su información personal sea
							correcta, esto para evitar problemas durante el
							proceso. Los cambios se guardarán al dar siguiente.
						</p>
						<div
							style={{
								display: "flex",

								width: "100%",

								justifyContent: "center",
							}}
						>
							<Form
								labelCol={{ ...layout.labelCol }}
								name="validate-profile"
								onFinish={(values) =>
									this.onFinish(
										values,
										dataValues(this.props.account.payload)
									)
								}
								validateMessages={null}
								scrollToFirstError
								initialValues={dataValues(
									this.props.account.payload
								)}
							>
								<Card
									key={updateIndex()}
									title="Datos"
									style={{
										width: 800,
										alignSelf: "center",
										margin: "1%",
										//fontWeight: "bold",
									}}
								>
									<div key={updateIndex()}>
										<Form.Item
											key={updateIndex()}
											label="Nombre completo"
											rules={null}
											style={{ marginBottom: 0 }}
										>
											<Form.Item
												key={updateIndex()}
												name="first_name"
												rules={[
													{
														required: true,
														message:
															"Por favor introduce tu nombre!",
													},
												]}
												hasFeedback
												style={{
													display: "inline-block",
													width: "calc(50% - 8px)",
												}}
											>
												<Input
													placeholder="Nombre(s)"
													size="large"
												/>
											</Form.Item>
											<Form.Item
												key={updateIndex()}
												name="last_name"
												rules={[
													{
														required: true,
														message:
															"Por favor introduce tus apellidos!",
													},
												]}
												hasFeedback
												style={{
													display: "inline-block",
													width: "calc(50% - 8px)",
													margin: "0 8px",
												}}
											>
												<Input
													placeholder="Apellidos"
													size="large"
												/>
											</Form.Item>
										</Form.Item>
										<Form.Item
											key={updateIndex()}
											name="enrollment"
											label="Matrícula"
											rules={[
												{
													required: true,
													tye: "number",
													message:
														"Por favor introduce tu matrícula!",
												},
											]}
											hasFeedback
										>
											<Input
												style={{ width: 160 }}
												size="large"
											/>
										</Form.Item>
										<Form.Item
											key={updateIndex()}
											label="Carrera"
											name="career"
											rules={[
												{
													required: true,
													message:
														"Por favor seleccione su carrera!",
												},
											]}
											hasFeedback
										>
											<Select
												size="large"
												style={{ width: 200 }}
											>
												<Select.Option value="eletromecanica">
													Ing. Electromecánica
												</Select.Option>
												<Select.Option value="electronica">
													Ing. Electrónica
												</Select.Option>
												<Select.Option value="gestion">
													Ing. Gestión Empresarial
												</Select.Option>
												<Select.Option value="industrial">
													Ing. Industrial
												</Select.Option>
												<Select.Option value="mecatronica">
													Ing. Mecatrónica
												</Select.Option>
												<Select.Option value="sistemas">
													Ing. Sistemas
													Computacionales
												</Select.Option>
												<Select.Option value="administracion">
													Lic. Administración
												</Select.Option>
											</Select>
										</Form.Item>
										<Form.Item
											label="Género"
											key={updateIndex()}
											name="gender"
											rules={[
												{
													required: true,
													message:
														"Por favor seleccione una opcion!",
												},
											]}
											hasFeedback
										>
											<Select
												style={{ width: 160 }}
												value="M"
												size="large"
											>
												<Select.Option value="mas">
													Masculino
												</Select.Option>
												<Select.Option value="fem">
													Femenino
												</Select.Option>
												<Select.Option value="ind">
													Otro
												</Select.Option>
											</Select>
										</Form.Item>
									</div>
								</Card>
								<Form.Item
									wrapperCol={{
										...layout.wrapperCol,
										offset: 8,
									}}
									orientation="right"
								>
									<Button type="primary" htmlType="submit">
										Siguiente
									</Button>
								</Form.Item>
							</Form>
						</div>
					</Fragment>
				) : (
					<p>CARGANDO</p>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		account: state.account,
		loading: state.account.loading,
		error: state.account.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdate: (
			first_name,
			last_name,
			enrollment,
			career,
			gender,
			titulation_type
		) =>
			dispatch(
				actions.accountUpdate(
					first_name,
					last_name,
					enrollment,
					career,
					gender,
					titulation_type
				)
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ValidateInfo);
