import React, { Component } from "react";
import {
  Button,
  Divider,
  Input,
  PageHeader,
  Space,
  Table,
  message,
  Modal,
  Descriptions,
} from "antd";
import * as action from "../../../store/actions/admin";
import { connect } from "react-redux";
import { columns } from "./columns";
import EditAccount from "./EditAccount";
import CreateAccount from "./CreateAccount";
import DeleteAccount from "./DeleteAccount";

const { Search } = Input;

class Accounts extends Component {
  constructor(props) {
    super(props);
    let type = {
      services: "Servicios Escolares",
      coordination: "Coordinación de Titulación",
      graduates: "Egresados",
    };

    this.state = {
      subtitle: type[this.props.type],
      create: false,
      delete: false,
      edit: false,
    };
  }

  componentDidMount() {
    this.props.getAccountDetails(this.props.type);
  }

  onCreate = (display) => {
    this.setState({ create: display });
  };

  onCloseCreate = () => {
    this.setState({
      create: false,
    });
  };

  onDeleteAccount = (data) => {
    this.setState({
      dataDel: data,
      delete: true,
    });
  };

  onEditAccount = (data) => {
    this.setState({
      edit: true,
      dataEdit: data,
    });
  };

  render() {
    let { dataDel } = this.state;
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <PageHeader
          className="site-page-header"
          title="Cuentas"
          subTitle={this.state.subtitle}
          style={{ margin: 0, paddingTop: 0 }}
        />
        <Space direction="horizontal">
          <Search
            placeholder="Correo electrónico"
            onSearch={(value) => console.log(value)}
            enterButton
          />
          <Button onClick={() => this.onCreate(true)}>Crear cuenta</Button>
        </Space>
        <Divider />
        <div
          style={{
            position: "relative",
            backgroundColor: "white",
            overflow: "hidden",
            minHeight: 500,
          }}
        >
          <CreateAccount
            enable={this.state.create}
            onClose={this.onCreate}
            type={this.props.type}
          />
          <DeleteAccount
            account={dataDel}
            enable={this.state.delete}
            onClose={() => {
              this.setState({
                delete: false,
                dataDel: null,
              });
            }}
          />
          <EditAccount
            visible={this.state.edit}
            data={this.state.dataEdit}
            onClose={() => this.setState({ edit: false })}
          />
          <Table
            pagination={true}
            bordered={true}
            rowKey={(item) => item.id}
            loading={this.props.loading}
            columns={columns(this.onDeleteAccount, this.onEditAccount)}
            dataSource={[...this.props.accountDataSource]}
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let accountDataSource = [];
  let error = { register_failed: null };
  let loading = false;
  let created = false;
  let status = null;
  let action = null;

  if (state.admin.payload.accounts !== undefined) {
    let accounts = state.admin.payload.accounts;
    loading = accounts.status === "loading";
    error = accounts.error;
    status = accounts.status;
    action = accounts.action;
    accountDataSource = accounts.data;
  }

  return {
    accountDataSource: accountDataSource,
    loading: loading,
    error: error,
    created: created,
    status: status,
    action: action,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAccountDetails: (type) => {
      dispatch(action.getAccountDetails(type));
    },
    deleteAccount: (id) => {
      dispatch(action.deleteAccount(id));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
