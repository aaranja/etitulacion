import React from "react";
import { Divider, Form, Input, Button, Select } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import "antd/dist/antd.css";
import * as action from "../store/actions/account";

let lastIndex = 0;
const updateIndex = () => {
  lastIndex++;
  return lastIndex;
};

class Account extends React.Component {
  state = {
    account: [],
    formFields: {
      enrollment: "",
    },
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  getUserData() {
    var token = localStorage.getItem("token");
    if (token === null) {
      this.props.history.push("/login/");
    } else {
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      axios.get("http://127.0.0.1:8000/api/account/").then((response) => {
        this.setState({
          account: response.data,
        });

        this.setState((prevState) => {
          let formFields = Object.assign({}, prevState.formFields);
          formFields["enrollment"] = response.data[0]["enrollment"];
          return { formFields };
        });
      });
    }
  }

  componentDidMount() {
    this.getUserData();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    //console.log(this.state.account)
    console.log("sin token");
    if (newProps.token === null) this.props.history.push("/login/");
    console.log(newProps);
  }
  onFinish = (values) => {
    console.log(values);
  };

  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const onFinish = (values) => {
      var account_data = this.state.account[0];
      //console.log(account_data)
      //console.log("Received values of form: ", values);

      //props.history.push("/");*/

      if (values.first_name === undefined)
        values.first_name = account_data.account.first_name;
      if (values.last_name === undefined)
        values.last_name = account_data.account.last_name;
      if (values.enrollment === undefined)
        values.enrollment = account_data.enrollment;
      if (values.career === undefined) values.career = account_data.career;
      if (values.gender === undefined) values.gender = account_data.gender;

      this.props.onUpdate(
        values.first_name,
        values.last_name,
        values.enrollment,
        values.career,
        values.gender,
        account_data.titulation_type
      );

      this.props.history.push("/");
      //this.setState();
      //window.location.reload(false);
    };

    //console.log(this.state.formFields)

    const profiles = this.state.account.map((profile) => {
      console.log(profile);
      return (
        <div key={updateIndex()} ref={this.myRef}>
          <Form.Item
            name="first_name"
            label="Nombre(s)"
            key={updateIndex()}
            rules={null}
          >
            <Input
              defaultValue={profile.account.first_name}
              style={{ width: 200 }}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Apellidos"
            rules={null}
            key={updateIndex()}
          >
            <Input
              defaultValue={profile.account.last_name}
              value={profile.account.last_name}
              size="large"
            />
          </Form.Item>
          <Form.Item
            key={updateIndex()}
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
              },
            ]}
          >
            <Input defaultValue={profile.account.email} size="large" />
          </Form.Item>
          <Form.Item
            key={updateIndex()}
            name="enrollment"
            label="Matrícula"
            rules={[
              {
                type: "number",
              },
            ]}
          >
            <Input
              style={{ width: 160 }}
              defaultValue={profile.enrollment}
              size="large"
            />
          </Form.Item>
          <Form.Item
            key={updateIndex()}
            label="Carrera"
            name="career"
            rules={[
              {
                message: "Por favor seleccione su carrera!",
              },
            ]}
          >
            <Select
              size="large"
              defaultValue={profile.career}
              style={{ width: 200 }}
            >
              <Select.Option value="eletromecanica">
                Ing. Electromecánica
              </Select.Option>
              <Select.Option value="electronica">
                Ing. Electrónica
              </Select.Option>
              <Select.Option value="gestion">
                Ing. Gestión Empresarial
              </Select.Option>
              <Select.Option value="industrial">Ing. Industrial</Select.Option>
              <Select.Option value="mecatronica">
                Ing. Mecatrónica
              </Select.Option>
              <Select.Option value="sistemas">
                Ing. Sistemas Computacionales
              </Select.Option>
              <Select.Option value="administracion">
                Lic. Administración
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Género"
            key={updateIndex()}
            name="gender"
            rules={[
              {
                message: "Por favor seleccione una opción!",
              },
            ]}
          >
            <Select
              defaultValue={profile.gender}
              style={{ width: 160 }}
              value="M"
              size="large"
            >
              <Select.Option value="M">Masculino</Select.Option>
              <Select.Option value="F">Femenino</Select.Option>
              <Select.Option value="O">Otro</Select.Option>
            </Select>
          </Form.Item>
        </div>
      );
    });
    //console.log(test_state.currentObject.enrollment.value)
    //<code>{JSON.stringify(this.state.account)}</code>

    return (
      <div>
        <Divider orientation="center">Información personal</Divider>
        <p> {this.state.account.enrollment}</p>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={(values) => onFinish(values)}
          validateMessages={null}
        >
          {profiles}
          <Form.Item
            wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
            orientation="right"
          >
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    name: state.name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdate: (
      first_name,
      last_name,
      enrollment,
      career,
      gender,
      titulation_type
    ) =>
      dispatch(
        action.accountUpdate(
          first_name,
          last_name,
          enrollment,
          career,
          gender,
          titulation_type
        )
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Account);
