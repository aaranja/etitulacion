import React, { Component } from "react";
import { Form, Input, Tooltip, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import axios from "axios";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class RegistrationForm extends Component {
  onFinish = (values, requestType, id) => {
    //console.log("Received values of form: ", values);
    const email = values.email;
    const password = values.password;
    const username = values.username;

    switch (requestType) {
      case "post":
        return axios
          .post("http://127.0.0.1:8000/api/", {
            email: email,
            password: password,
            username: username,
          })
          .then(window.location.reload(false))
          .catch((err) => console.error(err));

      case "put":
        return axios
          .put(`http://127.0.0.1:8000/api/${id}`, {
            email: email,
            password: password,
            username: username,
          })
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
      default:
        break;
    }
  };

  render() {
    return (
      <Form
        {...formItemLayout}
        name="register"
        initialValues={{}}
        scrollToFirstError
        onFinish={(values) =>
          this.onFinish(values, this.props.requestType, this.props.id)
        }
      >
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
              message: "Por favor introduce tu E-mail!",
            },
          ]}
        >
          <Input placeholder="Correo eléctronico" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: true,
              message: "Por favor introduce tu contraseña!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmar contraseña"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Por favor confirma tu contraseña!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Las contraseñas no coinciden!");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="username"
          label={
            <span>
              Matrícula&nbsp;
              <Tooltip title="Introduce tu No. de control">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: "Por favor introduce tu matrícula!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {this.props.btnText}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default RegistrationForm;
