import React, { Component } from "react";
import { Alert, Button, Form, Input } from "antd";
import ErrorList from "../../../components/ErrorList";

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      status: null,
      account: {},
      showError: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.error !== prevProps.error && this.props.error !== null) {
    }
  }

  render() {
    return (
      <>
        {this.props.error !== null ? (
          <Alert
            message="Error al registrar la cuenta."
            description={<ErrorList list={this.props.error} />}
            type="error"
            closable={true}
          />
        ) : null}
        <Form
          scrollToFirstError
          onFinish={(values) => this.props.onSubmit(values)}
          initialValues={{ layout: "horizontal" }}
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
            name="first_name"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Por favor introduce el nombre!",
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
                message: "Por favor introduce los apellidos!",
              },
            ]}
          >
            <Input placeholder="Apellidos" />
          </Form.Item>
          <Form.Item
            name="enrollment"
            label="No. control"
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
            dependencies={["password1"]}
            hasFeedback
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
            <Button type="primary" htmlType="submit">
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
