import React, { Component } from "react";
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Typography,
} from "antd";
import Expand from "react-expand-animated";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import * as action from "../../../../store/actions/admin";

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangingPassword: false,
      data: { id: null },
      loaded: false,
      saving: false,
    };

    this.form = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { saving } = this.state;
    if (this.props.visible && !prevProps.visible) {
      this.form.current.setFieldsValue(this.props.data);
    }

    if (saving && this.props.action === "update") {
      if (this.props.status === "success") {
        this.setState({ saving: false });
        message.success("Guardado correctamente");
      }
    }
  }

  render() {
    let { isChangingPassword } = this.state;
    let rules = [
      {
        required: true,
        message: "Este campo no puede estar vacío",
      },
    ];
    return (
      <Modal
        onCancel={this.props.onClose}
        visible={this.props.visible}
        confirmLoading={this.state.saving}
        okButtonProps={{ htmlType: "submit", form: "account_edit" }}
        okText="Guardar"
        okType="primary"
      >
        <Descriptions title="Editar información" />
        <Form
          ref={this.form}
          name="account_edit"
          labelCol={{
            sm: {
              span: 8,
              offset: 0,
            },
          }}
          wrapperCol={{
            sm: {
              span: 18,
              offset: 0,
            },
          }}
          onFinish={(values) => {
            this.setState({ saving: true });
            values["id"] = this.props.data.id;
            this.props.saveAccount(values);
          }}
        >
          <Form.Item name="first_name" label="Nombre(s)" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Apellidos" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Correo" rules={rules}>
            <Input />
          </Form.Item>
          <Divider>
            <Button
              type="link"
              onClick={() =>
                this.setState({ isChangingPassword: !isChangingPassword })
              }
              icon={isChangingPassword ? <UnlockOutlined /> : <LockOutlined />}
            >
              Cambiar contraseña
            </Button>
          </Divider>
          <Expand open={isChangingPassword}>
            <Form.Item
              name="password1"
              label="Contraseña"
              rules={[
                {
                  required: this.state.isChangingPassword,
                  message: "Por favor introduce la contraseña!",
                },
              ]}
            >
              <Input.Password placeholder="Contraseña" />
            </Form.Item>
            <Form.Item
              name="password2"
              label="Confirmar contraseña"
              dependencies={["password1"]}
              rules={[
                {
                  required: this.state.isChangingPassword,
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
          </Expand>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  let status = null;
  let action = null;
  if (state.admin.payload.accounts !== undefined) {
    let accounts = state.admin.payload.accounts;
    status = accounts.status;
    action = accounts.action;
  }
  return {
    status: status,
    action: action,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveAccount: (values) => {
      dispatch(action.updateAccount(values));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAccount);
