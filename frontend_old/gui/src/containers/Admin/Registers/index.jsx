import React, { Component } from "react";
import { Button, Card, Form, Input, PageHeader, Select } from "antd";
import { connect } from "react-redux";
import * as action from "../../../store/actions/admin";

class StaffRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      status: null,
    };
  }

  onFinish = (values) => {
    this.props.createAccount(values);
  };

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Registro"
          subTitle="Staff"
        />

        <Card
          style={{
            width: 500,
            alignSelf: "center",
            borderBottom: 0,
            borderLeft: 0,
            borderTop: 0,
          }}
        >
          <Form
            scrollToFirstError
            onFinish={(values) => this.onFinish(values)}
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
              label="Tipo de staff"
              name="user_type"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el tipo de staff!",
                },
              ]}
            >
              <Select placeholder="Seleccione el tipo de usuario">
                <Select.Option value="USER_SERVICES">
                  Servicios escolares
                </Select.Option>
                <Select.Option value="USER_COORDINAT">
                  Coordinación de titulación
                </Select.Option>
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
                  span: 16,
                  offset: 20,
                },
              }}
            >
              <Button type="primary" htmlType="submit">
                Registrar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    loading: false,
    status: null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAccount: (values) => dispatch(action.staffRegister(values)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffRegister);
