import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Card, Form, Input, Space, Typography} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

import {auth} from "../../store/services/auth";
import withNavigation from "../../routes/withRouter/withNavigation";

const {Title} = Typography;

class Register extends Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();

        this.state = {
            autoemail: "", saving: false, error: false, data: null,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const result = this.props.signupSelect(this.state.data)
        if (result.isError) {
            this.setFormErrors(result.error.data)
        } else {
            if (result.isSuccess) {
                console.log(result)
                // load new page to confirm email
                this.props.navigate('email-confirmation', {
                    state: {
                        email: result.data.email,
                    }
                })
            }
        }

    }

    onFinish = (values) => {
        this.setState({
            data: values,
        });
        this.props.onSignUp(values);
    };

    setAutoEmail = (enrollment) => {
        let email = "al" + enrollment + "@ite.edu.mx";
        this.form.current.setFieldsValue({email: email});
    };

    setFormErrors = (errors) => {
        let data = [];
        for (let entry in errors) {
            data.push({name: entry, errors: errors[entry]});
        }
        this.form.current.setFields(data);
    };

    render() {
        const result = this.props.signupSelect(this.state.data)
        const fill = (<Button
            key="0"
            onClick={() => {
                this.form.current.setFieldsValue({
                    enrollment: "16760256",
                    cellphone: "6463400552",
                    email: "al16760256@ite.edu.mx",
                    password1: "KAKAlaMORTE1",
                    password2: "KAKAlaMORTE1",
                });
            }}
        >
            Autofill
        </Button>);

        return (
            <div style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                marginTop: "50px",
                flexDirection: "column"
            }}>
                <Typography.Title level={3}>Crear cuenta</Typography.Title>
                <Card

                    style={{
                        justifySelf: "center",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "1px 3px 1px #9E9E9E",
                        width: "36em"
                    }}
                >
                    <Form
                        name="register"
                        labelCol={{span: 24}}
                        initialValues={{layout: "horizontal"}}
                        scrollToFirstError
                        ref={this.form}
                        onFinish={(values) => this.onFinish(values)}
                    >
                        <Form.Item
                            name="enrollment"
                            label="Matrícula"
                            rules={[{
                                required: true, message: "Por favor introduce tu matrícula!",
                            }, {
                                validator: (rule, value) => {
                                    if (value !== undefined) {
                                        if (value.length !== 8) {
                                            return Promise.reject("Matrícula no válida");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            },]}
                        >
                            <Input
                                placeholder="No. control"
                                maxLength="8"
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                onChange={(event) => {
                                    this.setAutoEmail(event.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            extra={<p>Generado automáticamente de su matrícula</p>}
                            rules={[{
                                type: "email", message: "E-mail no válido!",
                            }, {
                                required: true, message: "Por favor introduce tu E-mail!",
                            },]}
                        >
                            <Input placeholder="Correo eléctronico" disabled={true}/>
                        </Form.Item>
                        <Form.Item
                            name="cellphone"
                            label="No. Celular"
                            rules={[{
                                required: true, message: "Por favor introduce tu número de celular!",
                            }, {
                                validator: (rule, value) => {
                                    if (value !== undefined) {
                                        if (value.length !== 10) {
                                            return Promise.reject("Número no válido");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            },]}
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
                            name="password1"
                            label="Contraseña"
                            rules={[{
                                required: true, message: "Por favor introduce tu contraseña!",
                            },]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Contraseña"/>
                        </Form.Item>

                        <Form.Item
                            name="password2"
                            label="Confirmar contraseña"
                            dependencies={["password1"]}
                            hasFeedback
                            rules={[{
                                required: true, message: "Por favor confirma tu contraseña!",
                            }, ({getFieldValue}) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue("password1") === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject("Las contraseñas no coinciden!");
                                },
                            }),]}
                        >
                            <Input.Password placeholder="Confirmar contraseña"/>
                        </Form.Item>

                        <Form.Item labelCol={{span: 24}}>
                            <Space size="large" align="baseline" direction="vertical">
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <Button type="primary" htmlType="submit" loading={result.isLoading}>
                                        Crear cuenta
                                    </Button>{fill}</div>
                                <Typography.Text type="secondary">
                                    ¿Ya tienes una cuenta?
                                    <Link to="/login/">
                                        &nbsp; <ArrowRightOutlined/>&nbsp;Iniciar sesión
                                    </Link>
                                </Typography.Text>
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
        signupSelect: (data) => auth.endpoints.signup.select(data)(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // onAuth: (values) => dispatch(action.authSignUp(values)),
        onSignUp: (data) => {
            dispatch(auth.endpoints.signup.initiate(data))
        }
    };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Register));