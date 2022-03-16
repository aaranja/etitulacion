// class to register a new graduate user
// https://colorhunt.co/palette/0820322c394b334756ff4c29
import React from "react";
import {NavLink} from "react-router-dom";
import {
    Form,
    Input,
    Button,
    Select,
    Card,
    Typography,
    Space,
    notification,
} from "antd";
import * as action from "../../../store/actions/auth";
import * as itemLayout from "./ItemLayout";
import {ArrowLeftOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {connect} from "react-redux";

const {Title} = Typography;
const {Option} = Select;

class Register extends React.Component {
    onFinish = (values) => {
        this.props.onAuth(values);
    };

    openNotification = (error) => {
        notification.open({
            message: "Error",
            description: `La matrícula que has introducido ya se encuentra registrada.`,
            icon: <CloseCircleOutlined style={{color: "#FF4848"}}/>,
        });
    };

    componentDidUpdate(prevProps, prevState, context) {
        if (prevProps.loading && !this.props.loading && !this.props.loading) {
            //	if previous loading and current loading is different (true and false)
            //	and is any error, go to ("home¨)
            if (this.props.error === null) {
                this.props.navigate("/home");
            } else {
                // console.log(this.props.error.response.data);
                this.openNotification(this.props.error);
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
                        <Title level={3}>
                            Registro
                        </Title>
                    }
                    bordered={true}
                    style={{
                        width: 500,
                        alignSelf: "center",
                        textAlign: "center",
                        /*fontWeight: "bold",*/
                        boxShadow: "1px 3px 1px #9E9E9E",
                        borderRadius: 5 + "px",
                    }}
                    // headStyle={{
                    //     backgroundColor: "#082032",
                    //     borderTopLeftRadius: "5px",
                    //     borderTopRightRadius: "5px",
                    // }}
                >
                    <Form
                        {...itemLayout.form}
                        name="register"
                        initialValues={{layout: "horizontal"}}
                        scrollToFirstError
                        onFinish={(values) => this.onFinish(values)}
                        // validateMessages={this.props.error.response.data}
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
                            <Input placeholder="Nombre"/>
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
                            <Input placeholder="Apellidos"/>
                        </Form.Item>

                        <Form.Item
                            name="enrollment"
                            label="Matrícula"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor introduce tu matrícula!",
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
                                <Select.Option value="electronica">
                                    Ing. Electrónica
                                </Select.Option>
                                <Select.Option value="electromecanica">
                                    Ing. Electromecánica
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
                                    Ing. Sistemas Computacionales
                                </Select.Option>
                                <Select.Option value="administracion">
                                    Lic. Administración
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="cellphone"
                            label="No. Celular"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor introduce tu número de celular!",
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value !== undefined) {
                                            if (value.length !== 10) {
                                                return Promise.reject("Número no válido");
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="6461234567"
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
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
                                    required: false,
                                    message: "Por favor introduce tu E-mail!",
                                },
                            ]}
                        >
                            <Input placeholder="Correo eléctronico"/>
                        </Form.Item>

                        <Form.Item
                            name="password1"
                            label="Contraseña"
                            rules={[
                                {
                                    required: false,
                                    message: "Por favor introduce tu contraseña!",
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Contraseña"/>
                        </Form.Item>

                        <Form.Item
                            name="password2"
                            label="Confirmar contraseña"
                            dependencies={["password1"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor confirma tu contraseña!",
                                },
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue("password1") === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject("Las contraseñas no coinciden!");
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirmar contraseña"/>
                        </Form.Item>

                        <Form.Item {...itemLayout.tail}>
                            <Space size="large" align="baseline">
                                <NavLink to="/login/">
                                    <ArrowLeftOutlined/> &nbsp;&nbsp;Iniciar sesión
                                </NavLink>
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
        onAuth: (values) => dispatch(action.authSignUp(values)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
