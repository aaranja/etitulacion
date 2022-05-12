import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Form,
  Descriptions,
  Divider,
  Input,
  Select,
  Tag,
  Button,
  Space,
  Card,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  accountUpdate,
  accountStatusUpdate,
} from "../../../../store/actions/account";
import { processGetTitulationTypes } from "../../../../store/actions/serverdata";

const { Item } = Form;

class Information extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasChanges: false,
      canNext: false,
      saving: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.loading && !this.props.loading) {
      if (this.props.titulation_selected !== null) {
        this.props.enableNext(true);
      }
    }

    if (prevProps.saving && !this.props.saving) {
      /* changes saved */
      this.setState({
        hasChanges: false,
        canNext: true,
      });
      this.props.enableNext(true);
    }
  }

  componentDidMount() {
    this.props.getTitulationTypes();
  }

  onSave = (values) => {
    /* get the label of titulation type selected */
    for (const index in this.props.titulation_types) {
      if (
        this.props.titulation_types[index].value === values["titulation_type"]
      ) {
        values["titulation_type"] = this.props.titulation_types[index].label;
        break;
      }
    }
    this.props.onSave(values);
  };

  goNext = () => {
    return !(this.state.hasChanges || this.props.loading);
  };
  getStateValue = () => {
    const { value } = this.state;
    if (value) {
      return value;
    }
  };
  render() {
    let lastIndex = 0;
    const updateIndex = () => {
      lastIndex++;
      return lastIndex;
    };
    const layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
    console.log(this.props.account.payload);

    return (
      <div style={{}}>
        <Descriptions
          size="small"
          column={1}
          style={{ marginLeft: 40 }}
          layout="vertical"
        >
          <Descriptions.Item label={<b>Instrucciones</b>}>
            Verifique que toda su información personal sea correcta, además
            seleccione el tipo de proyecto de titulación.
          </Descriptions.Item>
        </Descriptions>

        {this.props.account.payload !== null || this.props.loading === false ? (
          <Card
            style={{
              margin: "10px",
            }}
            bodyStyle={{
              maxWidth: "640px",
              margin: "auto",
              display: "block",
            }}
          >
            <Form
              {...layout}
              onChange={() => {
                if (!this.state.hasChanges) {
                  this.setState({
                    hasChanges: true,
                  });
                }
              }}
              onFinish={(values) => {
                this.onSave(values);
              }}
              name="information"
              validateMessages={null}
              scrollToFirstError
              initialValues={this.props.account.payload}
            >
              <Item
                key={updateIndex()}
                name="enrollment"
                label="Matrícula"
                hasFeedback
              >
                <Input maxLength="8" disabled bordered={false} />
              </Item>
              <Item
                label="Nombre(s)"
                key={updateIndex()}
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "Por favor introduce tu nombre!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nombre(s)" size="large" />
              </Item>
              <Item
                key={updateIndex()}
                label="Apellidos"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "Por favor introduce tus apellidos!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Apellidos" size="large" />
              </Item>
              <Item
                key={updateIndex()}
                label="Carrera"
                name="career"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione su carrera!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  size="large"
                  onChange={() => {
                    if (!this.state.hasChanges) {
                      this.setState({
                        hasChanges: true,
                        canNext: false,
                      });
                    }
                  }}
                >
                  <Select.Option value="electromecanica">
                    Ing. Electromecánica
                  </Select.Option>
                  <Select.Option value="electronica">
                    Ing. Electrónica
                  </Select.Option>
                  <Select.Option value="gestion">
                    Ing. Gestión Empresarial
                  </Select.Option>
                  <Select.Option value="industrial">
                    Ing. Industrial
                  </Select.Option>
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
              </Item>
              <Item
                name="cellphone"
                label="No. Celular"
                rules={[
                  {
                    required: true,
                    message: "Por favor introduce tu número de celular!",
                  },
                  {
                    validator: (rule, value, callback) => {
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
                  size="large"
                  placeholder="6461234567"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Item>
              <Item
                label="Género"
                key={updateIndex()}
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione una opcion!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  size="large"
                  value={this.getStateValue()}
                  placeholder="select your gender"
                  onChange={() => {
                    if (!this.state.hasChanges) {
                      this.setState({
                        hasChanges: true,
                        canNext: false,
                      });
                    }
                  }}
                >
                  <Select.Option value="mas">Masculino</Select.Option>
                  <Select.Option value="fem">Femenino</Select.Option>
                  <Select.Option value="ind">Otro</Select.Option>
                </Select>
              </Item>
              <Item
                label="Tipo de titulación"
                key={updateIndex()}
                name="titulation_type"
                rules={[
                  {
                    required: true,
                    message: "Seleccione el tipo de titulación!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  size="large"
                  options={this.props.titulation_types}
                  onChange={() => {
                    if (!this.state.hasChanges) {
                      this.setState({
                        hasChanges: true,
                        canNext: false,
                      });
                    }
                  }}
                />
              </Item>
              <Form.Item {...tailFormItemLayout}>
                <Space>
                  <Button
                    key={updateIndex()}
                    disabled={!this.state.hasChanges}
                    htmlType="submit"
                    form="information"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>
                  <Tag visible={this.state.hasChanges} key="3">
                    Tienes cambios sin guardar
                  </Tag>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <p>Cargando</p>
        )}
      </div>
    );
  }
}

/* function to set structure to display on select form */
const getTypeList = (types) => {
  let titulation_list = [];
  for (const key in types) {
    titulation_list.push({ label: types[key].name, value: types[key].id });
  }
  return titulation_list;
};

const mapStateToProps = (state) => {
  let status = null;
  let titulation_types = null;
  let titulation_selected = null;
  let dataTitulation;
  let loading = true;
  let saving = false;
  if (state.account.payload !== null) {
    status = state.account.payload.status;
    if (state.serverdata.payload !== null) {
      dataTitulation = state.serverdata.payload.titulations;
      titulation_types = getTypeList(dataTitulation);
      console.log(titulation_types);

      // if graduate has selected a titulation type, set it
      if (state.account.payload.titulation_type !== null) {
        for (const key in dataTitulation) {
          if (
            dataTitulation[key].name === state.account.payload.titulation_type
          ) {
            titulation_selected = dataTitulation[key].id;
            break;
          }
        }
      }
      loading = false;
    }
  }

  // if is nat loading and execute a call to dispatch, is saving something
  if (!loading) saving = state.account.loading;
  else {
    // LOADING INITIAL DATA
  }

  return {
    /* account data */ account: state.account,
    /* loading page */ loading: loading,
    /* loading error */ error: state.account.error,
    /* account status */ status: status,
    /* titulation types list */ titulation_types: titulation_types,
    /* titulation selected key */ titulation_selected: titulation_selected,
    /* saving state */ saving: saving,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (values) => {
      dispatch(accountUpdate(values));
    },
    onNext: (status) => {
      dispatch(accountStatusUpdate(status));
    },
    getTitulationTypes: () => {
      dispatch(processGetTitulationTypes());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Information);
