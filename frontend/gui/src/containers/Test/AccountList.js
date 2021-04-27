import React from "react";
import { Divider, Table } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import axios from "axios";
//import Account from "../components/Account"

//import RegistrationForm from "../components/RegistrationForm";

let lastIndex = 0;
const updateIndex = () => {
  lastIndex++;
  return lastIndex;
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: `id${updateIndex()}`,
    render: (text) => <a href={`account/${text}`}>{text}</a>,
  },
  {
    title: "Correo",
    dataIndex: "email",
    key: `email${updateIndex()}`,
  },
  {
    title: "Nombre",
    dataIndex: "first_name",
    key: `first_name${updateIndex()}`,
  },
  {
    title: "Apellidos",
    dataIndex: "last_name",
    key: `last_name${updateIndex()}`,
  },
];

class AccountList extends React.Component {
  state = {
    accounts: [],
  };

  componentWillReceiveProps(newProps) {
    console.log("este es el token: ".concat(newProps.token));
    if (newProps.token) {
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${newProps.token}`,
      };
      axios.get("http://127.0.0.1:8000/api/").then((res) => {
        this.setState({
          accounts: res.data,
        });
        console.log(res.data);
      });
    }
  }

  render() {
    return (
      <div>
        <Divider orientation="left">Cuentas</Divider>
        <Table
          dataSource={this.state.accounts}
          columns={columns}
          rowKey="id"
          //renderItem={(item) => <Account data={item} />}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(AccountList);
