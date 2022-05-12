import React, { Component } from "react";
import { Descriptions, Modal, message } from "antd";
import { connect } from "react-redux";
import * as action from "../../../../store/actions/admin";

class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      error: false,
      messages: {},
      loading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { deleting } = this.state;
    const { action, status, error } = this.props;
    if (deleting && action === "delete") {
      if (status === "success" && prevProps.status === "loading") {
        message.success("Cuenta eliminada correctamente").then();
        this.setState({
          deleting: false,
          error: false,
        });
        this.props.onClose();
      } else {
        if (status === "failure" && prevProps.status === "loading") {
          message.error("Error al eliminar esta cuenta").then();
          this.setState({
            deleting: false,
            error: true,
          });
        }
      }
    }
  }

  onCancel = () => {
    this.setState({});
  };
  onDelete = () => {
    this.setState({
      deleting: true,
    });
    this.props.deleteAccount(this.props.account.id);
  };

  render() {
    const { enable, account } = this.props;
    return (
      <Modal
        visible={enable}
        okText="Eliminar"
        okType="danger"
        onCancel={this.props.onClose}
        onOk={this.onDelete}
        confirmLoading={this.state.deleting}
      >
        {this.props.enable ? (
          <Descriptions column={1} title={"¿Eliminar la siguiente cuenta?"}>
            <Descriptions.Item label="Correo">
              {account.email}
            </Descriptions.Item>
            <Descriptions.Item label="Nombre">
              {account.first_name + " " + account.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="F. Registro">
              {account.date_joined}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
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
    loading = false;
    error = accounts.error;
    status = accounts.status;
    action = accounts.action;
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
    deleteAccount: (id) => {
      dispatch(action.deleteAccount(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
