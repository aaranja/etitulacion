import React, { Component } from "react";
import { Button, Drawer, message, Form, Input, Alert } from "antd";
import * as action from "../../../../store/actions/admin";
import { connect } from "react-redux";

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      message: {},
      saving: false,
      error: false,
    };
    this.form = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { saving } = this.state;
    const { status, action } = this.props;
    if (saving && action === "create") {
      if (status === "success" && prevProps.status === "loading") {
        message.success("Cuenta creada correctamente").then();
        this.setState({
          saving: false,
          error: false,
        });
        this.form.current.resetFields();
        this.props.onClose(false);
      } else {
        if (status === "failure" && prevProps.status === "loading") {
          message.error("Error al crear la cuenta").then();
          let { data } = this.props.error.response;
          this.setState({
            saving: false,
            error: true,
            message: data.message !== undefined ? data.message : {},
          });
        }
      }
    }
  }

  onCreateAccount = (values) => {
    this.setState({
      saving: true,
      error: false,
    });
    this.props.createAccount(values, this.props.type);
  };

  render() {
    const validate = (name) => {
      const { error, message } = this.state;
      if (error && message[name] !== undefined) {
        return {
          validateStatus: "error",
          help: message[name].map((item, key) => (
            <Alert key={key} message={item} type="error" />
          )),
        };
      } else return {};
    };

    return (
      <Drawer
        title="Crear cuenta"
        placement="left"
        closable={true}
        visible={this.props.enable}
        onClose={() => {
          this.props.onClose(false);
        }}
        getContainer={false}
        width={450}
        height={500}
        style={{ position: "absolute" }}
      >
        <Form
          scrollToFirstError
          onFinish={(values) => this.onCreateAccount(values)}
          initialValues={{ layout: "horizontal" }}
          help={{ email: "ayuda" }}
          ref={this.form}
          validateMessages={this.state.errors}
          labelCol={{
            sm: {
              span: 11,
            },
          }}
          wrapperCol={{
            sm: {
              span: 18,
              offset: 0,
            },
          }}
          style={{ margin: 20 }}
        >
          <Form.Item
            name="enrollment"
            label="No. control"
            {...validate("enrollment")}
            rules={[
              {
                required: true,
                message: "Por favor introduce el número de control!",
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
            name="email"
            label="E-mail"
            {...validate("email")}
            hasFeedback={true}
            rules={[
              {
                type: "email",
                message: "E-mail no válido!",
              },
              {
                required: true,
                message: "Por favor introduce el correo electrónico!",
              },
            ]}
          >
            <Input placeholder="Correo eléctronico" />
          </Form.Item>
          <Form.Item
            name="password1"
            label="Contraseña"
            {...validate("password1")}
            rules={[
              {
                required: true,
                message: "Por favor introduce la contraseña!",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item
            name="password2"
            label="Confirmar contraseña"
            {...validate("password2")}
            dependencies={["password1"]}
            rules={[
              {
                required: true,
                message: "Por favor confirma la contraseña!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password1") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject("Las contraseñas no coinciden!");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirmar contraseña" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 24,
                offset: 11,
              },
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.saving}
            >
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  let loading = true;
  let error,
    status,
    action = null;
  if (state.admin.payload.accounts !== undefined) {
    let { accounts } = state.admin.payload;
    status = accounts.status;
    error = accounts.error;
    action = accounts.action;
    loading = false;
  }
  return {
    loading: loading,
    status: status,
    error: error,
    action: action,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAccount: (values, type) =>
      dispatch(action.staffRegister(values, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
