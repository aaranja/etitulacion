import React, { useState } from "react";
import { Form, Input, /*Tooltip,*/ Button, Select, Radio } from "antd";
//import { QuestionCircleOutlined } from "@ant-design/icons";
import * as action from "../store/actions/auth";

import { connect } from "react-redux";

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
      span: 14,
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

const Signup = (props) => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.onAuth(
      values.email,
      values.first_name,
      values.last_name,
      values.password1,
      values.password2,
      values.enrollment,
      values.career,
      values.gender
    );
    props.history.push("/");
  };

  return (
    <Form
      {...formItemLayout}
      name="register"
      initialValues={{ layout: useState("horizontal") }}
      scrollToFirstError
      onFinish={(values) => onFinish(values)}
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
        <Input placeholder="Nombre" />
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
        <Input placeholder="Apellidos" />
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
        <Input placeholder="No. control" />
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
        <Select>
          <Select.Option value="sistemas">Ing. Sistemas</Select.Option>
          <Select.Option value="mecatronica">Ing. Mecatrónica</Select.Option>
        </Select>
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
        <Radio.Group>
          <Radio.Button value="MAS">M</Radio.Button>
          <Radio.Button value="FEM">F</Radio.Button>
          <Radio.Button value="INDF">Otro</Radio.Button>
        </Radio.Group>
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
            message: "Por favor introduce tu E-mail!",
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
            message: "Por favor introduce tu contraseña!",
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
            message: "Por favor confirma tu contraseña!",
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

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Registrar
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (
      email,
      first_name,
      last_name,
      password1,
      password2,
      enrollment,
      career,
      gender
    ) =>
      dispatch(
        action.authSignUp(
          email,
          first_name,
          last_name,
          password1,
          password2,
          enrollment,
          career,
          gender
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
