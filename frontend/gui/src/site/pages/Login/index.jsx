import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  notification,
  Typography,
  Space,
} from "antd";

import { UserOutlined, LockOutlined, SmileOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as action from "../../../store/actions/auth";
import Image from "../../img/logo.png";

const { Title } = Typography;

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
      style: {
        marginTop: 70,
      },
    });
  };

  componentDidUpdate(prevProps, prevState, context) {
    if (!this.props.loading) {
      //when isn't loading the loggin
      if (this.props.error != null) {
        this.openNotification();
      } else {
        this.props.navigate("/home");
        // without erros -> go to home
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
          marginTop: -100,
          height: "100%",
        }}
      >
        <Card
          title={
            <React.Fragment>
              <Title level={3}>Iniciar sesión</Title>
              <img src={Image} style={{ width: "100%" }} alt=" " />
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
            <Form.Item name="email" rules={this.rules(email)}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Correo electrónico"
              />
            </Form.Item>
            <Form.Item name="password" rules={this.rules(password)}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Space direction="vertical">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ alignSelf: "center", fontSize: "medium" }}
                  loading={this.props.loading}
                >
                  Iniciar Sesión
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Card.Meta
            title={
              <p style={{}}>
                No tienes cuenta? {"  "}
                <NavLink to="/signup/" style={{}}>
                  Registrate
                </NavLink>
              </p>
            }
          />
        </Card>
      </div>
    );
  }
}

// const mergeProps = (ownProps, ownMap, dispatchProps) => {
//   return {
//     ...ownProps,
//     ...ownMap,
//     ...dispatchProps,
//   };
// };

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(action.authLogin(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
