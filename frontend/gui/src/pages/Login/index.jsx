import React, {Component} from "react";

import {connect} from "react-redux";

import {Link} from "react-router-dom";
import {Alert, Button, Card, Form, Input, Typography,} from "antd";
import {UserOutlined, LockOutlined,} from "@ant-design/icons";

import withNavigation from "../../routes/withRouter/withNavigation";
import {auth} from "../../store/services/auth";

const {Title} = Typography;

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            messages: [],
            email: null,
        };
    }

    /*Send login data to store auth actions*/
    onFinish = (values) => {
        let credentials = {
            email: values.email,
            password: values.password,
        }
        this.setState({
            error: false, messages: [],
            email: credentials,
            resul: {}
        });

        this.props.authSession(credentials);
    };

    rules = (textString) => {
        return [{
            required: true, message: "Por favor introduce tu " + textString + "!",
        },];
    };

    loginSuccess = (logged, verification) => {
        if (logged && verification) {
            this.props.navigate('')
        }
    }

    render() {
        let result = this.props.auth_select(this.state.email)

        let verified = () => {
            if (result.isSuccess && !result.data.email_verified) {

                return <Alert
                    type="warning"
                    style={{marginBottom: "5px"}}

                    message={
                        <p>
                            {"Tu cuenta no ha sido verificada. Haga clic en el siguiente enlace para verificar. "}
                            <Link to={"/signup/email-confirmation"}
                                  state={{email: this.state.email.email}}>Verificar</Link>
                        </p>}
                    closable={false}
                />
            }
            return null;
        }


        const email = "Correo electrónico";
        const password = "Contraseña";
        return <div
            style={{
                display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5vh", height: "100%",
            }}
        >
            <Card
                title={<React.Fragment>
                    <Title level={3} style={{textAlign: "center"}}>
                        Iniciar sesión
                    </Title>
                    {/*<img src={Image} style={{width: "100%"}} alt=" "/>*/}
                </React.Fragment>}
                actions={[

                    <Link to="/signup/" style={{width: "80%"}}>¿Quieres crear una cuenta? Haz clic aquí</Link>]}
                style={{
                    borderRight: 0,
                    borderBottom: 0,
                    width: 300,
                    alignSelf: "center",
                    fontSize: "20",
                    fontWeight: "bold",
                    boxShadow: "1px 3px 1px #9E9E9E",
                }}
            >
                {result.isError ? (<Alert
                    type="error"
                    style={{marginBottom: "5px"}}

                    message={result.status === 0 ? result.error.data : result.error.data['non_field_errors']}
                    closable={true}
                />) : null}
                {verified()}
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    style={{textAlign: "center"}}
                    onFinish={this.onFinish}
                >
                    <Form.Item name="email" rules={this.rules(email)}>
                        <Input
                            size="large"
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="Correo electrónico"
                        />
                    </Form.Item>
                    <Form.Item name="password" rules={this.rules(password)}
                               extra={<div style={{width: "100%", display: "flex", marginTop: 5}}>
                                   <Link to="/account/password-reset" style={{marginLeft: "auto"}}>
                                       &nbsp; Recuperar contraseña&nbsp;
                                   </Link>
                               </div>}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            size="large"
                            style={{alignSelf: "center"}}
                            loading={result.isLoading}
                        >
                            Iniciar Sesión
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        auth_select: (email) => auth.endpoints.authSession.select(email)(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authSession: (credentials) => {
            dispatch(auth.endpoints.authSession.initiate(credentials))
        }
    }
}


export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Login));