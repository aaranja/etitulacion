import React, { Component } from "react";
import { Button, Card, Form, Input, message, Space, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { onSignup } from "../../../store/actions/services";
const { Title } = Typography;
const propTypes = {
  onSignUp: PropTypes.func,
};

class RegisterGraduateForm extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();

    this.state = {
      autoemail: "",
      saving: false,
      error: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { saving } = this.state;
    const { action, status } = this.props;
    if (saving && action === "post") {
      const prevLoad = prevProps.status === "loading";
      if (status === "success" && prevLoad) {
        this.props.onDone(this.props["data"].email);
      } else {
        if (status === "failure" && prevLoad) {
          const { error } = this.props;
          this.setFormErrors(error.response.data);
          this.setState({
            saving: false,
          });
        }
      }
    }
  }

  onFinish = (values) => {
    this.setState({
      saving: true,
    });
    this.props.onSignUp(values);
  };
  setAutoEmail = (enrollment) => {
    let email = "al" + enrollment + "@ite.edu.mx";
    this.form.current.setFieldsValue({ email: email });
  };

  setFormErrors = (errors) => {
    let data = [];
    for (let entry in errors) {
      data.push({ name: entry, errors: errors[entry] });
    }
    this.form.current.setFields(data);
  };

  render() {
    const { saving } = this.state;
    const fill = (
      <Button
        key="0"
        onClick={() => {
          this.form.current.setFieldsValue({
            enrollment: "16760256",
            cellphone: "6464030234",
            email: "al16760256@ite.edu.mx",
            password1: "KAKAlaMORTE1",
            password2: "KAKAlaMORTE1",
          });
        }}
      >
        Autofill
      </Button>
    );

    return (
      <Card
        title={
          <Title style={{ textAlign: "center" }} level={3}>
            Registro
          </Title>
        }
        extra={[fill]}
        bordered={true}
        style={{
          justifySelf: "center",
          display: "flex",
          flexDirection: "column",
          boxShadow: "1px 3px 1px #9E9E9E",
        }}
      >
        <Form
          name="register"
          labelCol={{ span: 24 }}
          initialValues={{ layout: "horizontal" }}
          scrollToFirstError
          ref={this.form}
          onFinish={(values) => this.onFinish(values)}
        >
          <Form.Item
            name="enrollment"
            label="Matrícula"
            rules={[
              {
                required: true,
                message: "Por favor introduce tu matrícula!",
              },
              {
                validator: (rule, value) => {
                  if (value !== undefined) {
                    if (value.length !== 8) {
                      return Promise.reject("Matrícula no válida");
                    } else {
                      return Promise.resolve();
                    }
                  }
                },
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
              onChange={(event) => {
                this.setAutoEmail(event.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            extra={<p>Generado automáticamente de su matrícula</p>}
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
            <Input placeholder="Correo eléctronico" disabled={true} />
          </Form.Item>
          <Form.Item
            name="cellphone"
            label="No. Celular"
            rules={[
              {
                required: true,
                message: "Por favor introduce tu número de celular!",
              },
              {
                validator: (rule, value) => {
                  if (value !== undefined) {
                    if (value.length !== 10) {
                      return Promise.reject("Número no válido");
                    } else {
                      return Promise.resolve();
                    }
                  }
                },
              },
            ]}
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

          <Form.Item labelCol={{ span: 24 }}>
            <Space size="large" align="baseline" direction="vertical">
              <Button type="primary" htmlType="submit" loading={saving}>
                Registrar
              </Button>
              <Typography.Text type="secondary">
                ¿Ya tienes una cuenta?
                <NavLink to="/login/">
                  &nbsp; Iniciar sesión&nbsp;
                  <ArrowRightOutlined />
                </NavLink>
              </Typography.Text>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

RegisterGraduateForm.propTypes = propTypes;

const mapStateToProps = (state) => {
  let status,
    error,
    data,
    action = null;
  if (state.services.payload["register"] !== undefined) {
    const { register } = state.services.payload;
    status = register.status;
    error = register.error;
    action = register.action;
    data = register.data;
  }
  return {
    status: status,
    action: action,
    error: error,
    data: data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (values) => dispatch(onSignup(values)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterGraduateForm);
