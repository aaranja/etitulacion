import React, { Fragment } from "react";
import { Divider, Form, Input, Button, Select } from "antd";
import axios from "axios";
import "antd/dist/antd.css";
import * as action from "../../store/actions/account";
import { connect } from "react-redux";

class ValidateInfo extends React.Component {
	state = { account: [] };

	getUserData() {
		var token = localStorage.getItem("token");
		if (token === null) {
			//this.props.history.push("/login/");
		} else {
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios.get("http://127.0.0.1:8000/api/account/").then((response) => {
				this.setState({
					account: response.data,
				});
			});
		}
	}

	componentDidMount() {
		this.getUserData();
	}

	render() {
		const onFinish = (values) => {
			//console.log(values);
			var account_data = this.state.account[0];
			if (values.first_name === undefined)
				values.first_name = account_data.account.first_name;
			if (values.last_name === undefined)
				values.last_name = account_data.account.last_name;
			if (values.enrollment === undefined)
				values.enrollment = account_data.enrollment;
			if (values.career === undefined) values.career = account_data.career;
			if (values.gender === undefined) values.gender = account_data.gender;

			this.props.callbackFromParent("2");

			this.props.onUpdate(
				values.first_name,
				values.last_name,
				values.enrollment,
				values.career,
				values.gender,
				account_data.titulation_type
			);
		};

		let lastIndex = 0;
		const updateIndex = () => {
			lastIndex++;
			return lastIndex;
		};

		const layout = {
			labelCol: {
				span: 8,
			},
			wrapperCol: {
				span: 16,
			},
		};

		const dataValues = this.state.account.map((profile) => {
			return {
				["name"]: profile.account.first_name,
				["last_name"]: profile.account.last_name,
				["enrollment"]: profile.enrollment,
				["career"]: profile.career,
				["gender"]: profile.gender,
			};
		});

		const profiles = this.state.account.map((profile) => {
			return (
				<div key={updateIndex()}>
					<Form.Item
						name="name"
						label="Nombre(s)"
						key={updateIndex()}
						rules={null}
					>
						<Input style={{ width: 200 }} size="large" />
					</Form.Item>
					<Form.Item
						name="last_name"
						label="Apellidos"
						rules={null}
						key={updateIndex()}
					>
						<Input size="large" />
					</Form.Item>

					<Form.Item
						key={updateIndex()}
						name="enrollment"
						label="Matrícula"
						rules={[
							{
								type: "number",
							},
						]}
					>
						<Input style={{ width: 160 }} size="large" />
					</Form.Item>
					<Form.Item
						key={updateIndex()}
						label="Carrera"
						name="career"
						rules={[
							{
								message: "Por favor seleccione su carrera!",
							},
						]}
					>
						<Select size="large" style={{ width: 200 }}>
							<Select.Option value="eletromecanica">
								Ing. Electromecánica
							</Select.Option>
							<Select.Option value="electronica">
								Ing. Electrónica
							</Select.Option>
							<Select.Option value="gestion">
								Ing. Gestión Empresarial
							</Select.Option>
							<Select.Option value="industrial">Ing. Industrial</Select.Option>
							<Select.Option value="mecatronica">
								Ing. Mecatrónica
							</Select.Option>
							<Select.Option value="sistemas">
								Ing. Sistemas Computacionales
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
								message: "Por favor seleccione una opción!",
							},
						]}
					>
						<Select style={{ width: 160 }} value="M" size="large">
							<Select.Option value="M">Masculino</Select.Option>
							<Select.Option value="F">Femenino</Select.Option>
							<Select.Option value="O">Otro</Select.Option>
						</Select>
					</Form.Item>
				</div>
			);
		});

		return (
			<div>
				<Divider orientation="center">Información personal</Divider>
				{dataValues[0] !== undefined ? (
					<Fragment>
						<p>
							Verifique que toda su información personal sea correcta, esto para
							evitar problemas durante el proceso. Los cambios se guardarán al
							dar siguiente.
						</p>
						<Form
							{...layout}
							name="nest-messages"
							onFinish={(values) => onFinish(values)}
							validateMessages={null}
							initialValues={dataValues[0]}
						>
							{profiles}
							<Form.Item
								wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
								orientation="right"
							>
								<Button type="primary" htmlType="submit">
									Siguiente
								</Button>
							</Form.Item>
						</Form>
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
		token: state.token,
		name: state.name,
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
				action.accountUpdate(
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
