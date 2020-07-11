import React from "react";
import { Divider, Table } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import Account from "../components/Account"

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

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/").then((res) => {
      this.setState({
        accounts: res.data,
      });
      console.log(res.data);
    });
  }

  render() {return (
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

export default AccountList;
