import React, { Component } from "react";
import { Button, Divider, Drawer, Input, PageHeader, Space, Table } from "antd";
import * as action from "../../../store/actions/admin";
import { connect } from "react-redux";

import RegisterForm from "../RegisterForm";
import { columns } from "./columns";

const { Search } = Input;

class Accounts extends Component {
  constructor(props) {
    super(props);
    let type = {
      services: "Servicios Escolares",
      coordination: "Coordinación de Titulación",
      graduate: "Egresados",
    };

    this.state = {
      subtitle: type[this.props.type],
      visible: false,
      creating: false,
    };
  }

  componentDidMount() {
    this.props.getAccountDetails(this.props.type);
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onCreateAccount = (values) => {
    this.props.createAccount(values, this.props.type);
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%", padding: 20 }}>
        <PageHeader
          className="site-page-header"
          title="Cuentas"
          subTitle={this.state.subtitle}
          style={{ margin: 0 }}
        />
        <Space direction="horizontal">
          <Search
            placeholder="No. Control"
            onSearch={(value) => console.log(value)}
            enterButton
          />
          <Button onClick={() => this.showDrawer()}>Crear cuenta</Button>
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
          <Drawer
            title="Crear cuenta"
            placement="left"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
            getContainer={false}
            width={450}
            height={500}
            style={{ position: "absolute" }}
          >
            <RegisterForm
              key="register-form"
              onSubmit={this.onCreateAccount}
              error={this.props.error["register_failed"]}
              success={false}
            />
          </Drawer>
          <div>
            <Table
              columns={columns}
              dataSource={this.props.accountDataSource}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let accountDataSource = [];
  let error = { register_failed: null };
  if (state.admin.payload !== null) {
    if (state.admin.payload.accounts !== undefined) {
      accountDataSource = state.admin.payload.accounts;
    }
  }

  if (state.admin.error !== null) {
    let state_error = state.admin.error;
    error[state_error.type] = state_error.response.data.message;
  }
  return {
    accountDataSource: accountDataSource,
    loading: false,
    status: null,
    error: error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createAccount: (values, type) =>
      dispatch(action.staffRegister(values, type)),
    getAccountDetails: (type) => {
      dispatch(action.getAccountDetails(type));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
