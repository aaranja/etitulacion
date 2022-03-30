import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  notification,
  Typography,
  Space,
  Alert,
} from "antd";

import { UserOutlined, LockOutlined, SmileOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as action from "../../../store/actions/auth";
import Image from "../../img/logo.png";

const { Title } = Typography;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      messages: [],
    };
  }

  /*Send login data to store auth actions*/
  onFinish = (values) => {
    this.setState({
      error: false,
      messages: [],
    });
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

  componentDidUpdate(prevProps, prevState, context) {
    const { status } = this.props;
    const prevLoad = prevProps.status === "loading";

    if (status === "success" && prevLoad) {
      this.props.navigate("/home");
    } else {
      if (status === "fail" && prevLoad) {
        console.log(this.props.error.toJSON());
        if (this.props["error"].response !== undefined) {
          const { data, status } = this.props["error"].response;
          let messages =
            data["non_field_errors"] !== undefined
              ? data["non_field_errors"]
              : [];
          this.setState({
            error: true,
            showVerifyLink: status === 403,
            messages: messages,
          });
        }
      }
    }
  }

  render() {
    const email = "Correo electrónico";
    const password = "Contraseña";
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "5vh",
          height: "100%",
        }}
      >
        <Card
          title={
            <React.Fragment>
              <Title level={3} style={{ textAlign: "center" }}>
                Iniciar sesión
              </Title>
              <img src={Image} style={{ width: "100%" }} alt=" " />
            </React.Fragment>
          }
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
          {this.state.error ? (
            <Alert
              type="error"
              style={{ marginBottom: "5px" }}
              showIcon={true}
              message={"Error"}
              closable={true}
              description={
                <>
                  {this.state.messages.map((msg, key) => (
                    <Typography.Text key={key}>{msg}</Typography.Text>
                  ))}
                  {this.state.showVerifyLink ? (
                    <NavLink to={"/signup/verificate-email/"}>
                      {" "}
                      Verficar correo{" "}
                    </NavLink>
                  ) : null}
                </>
              }
            />
          ) : null}

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            style={{ textAlign: "center" }}
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
    status: state.auth.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(action.authLogin(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
