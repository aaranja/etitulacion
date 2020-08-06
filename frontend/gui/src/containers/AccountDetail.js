import React from "react";
import { Divider, Card, Button } from "antd";
import "antd/dist/antd.css";
import axios from "axios";

//import RegistrationForm from "../components/RegistrationForm";

class AccountDetail extends React.Component {
  state = {
    account: {},
  };

  componentDidMount() {
    const account_id = this.props.match.params.accountID;
    axios.get(`http://127.0.0.1:8000/api/${account_id}/`).then((res) => {
      this.setState({
        account: res.data,
      });
      console.log(res.data);
    });
  }

  handleOnDelete = (e) => {
    const account_id = this.props.match.params.accountID;
    axios.delete(`http://127.0.0.1:8000/api/${account_id}`);
    this.props.history.push("/");
    this.forceUpdate();
  };
  render() {
    return (
      <div>
        <Divider orientation="left">Cuenta</Divider>
        <Card title={`ID: ${this.state.account.id}`}>
          <p>Correo: {this.state.account.email}</p>
          <p>
            Nombre: {this.state.account.first_name}{" "}
            {this.state.account.last_name}
          </p>
        </Card>

        <br />
        <h2>Modificar cuenta</h2>
        {/* <RegistrationForm
          requestType="put"
          account_id={this.props.match.params.accountID}
          btnText="Actualizar"
        /> */}
        <form onSubmit={this.handleOnDelete}>
          <Button type="danger" htmlType="submit">
            Eliminar
          </Button>
        </form>
      </div>
    );
  }
}

export default AccountDetail;
