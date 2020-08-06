import React from "react";
import { Form, Input, Button, Spin } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as action from "../store/actions/auth";
import "../css/login.css";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

//let errorMessage = null;

class NormalLoginForm extends React.Component {
  onFinish = (values) => {
    this.props.onAuth(values.email, values.password);
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    //console.log(localStorage.getItem('token'))
    if (!newProps.loading)
      if (newProps.token !== null) this.props.history.push("/home/");
  }

  render() {
    return (
      <div>
        {this.props.error !== null ? <p> {this.props.error}</p> : null}
        {this.props.loading ? (
          <Spin indicator={antIcon} />
        ) : (
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Por favor introduce tu correo electrónico!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Correo electrónico"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor introduce tu contraseña!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
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
              O{" "}
              <NavLink to="/signup/" style={{ marginLeft: 20 }}>
                Registrate
              </NavLink>
            </Form.Item>
          </Form>
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
    onAuth: (email, password) => dispatch(action.authLogin(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);
