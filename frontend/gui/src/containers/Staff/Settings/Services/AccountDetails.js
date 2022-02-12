import React, { Component } from "react";
import { getAccountDetails } from "../../../../store/actions/staff";
import { connect } from "react-redux";
import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Form,
  Input,
  Layout,
  PageHeader,
  Space,
  Tag,
} from "antd";

const { Content } = Layout;

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasChanges: false,
      canNext: false,
      saving: false,
    };
  }

  componentDidMount() {
    this.props.getAccount();
  }

  onSave = (values) => {
    console.log(values);
  };

  render() {
    let lastIndex = 0;
    const updateIndex = () => {
      lastIndex++;
      return lastIndex;
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 16,
        offset: 8,
      },
    };
    return (
      <div>
        <PageHeader title="Datos personales" subTitle="Configuración">
          <Descriptions size="small" column={1}>
            <Descriptions.Item label={<b>Información</b>}>
              Sección de configuración de los datos personales.
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Content
          style={{ marginLeft: 25, marginRight: 120, paddingBottom: 20 }}
        >
          <Form
            {...formItemLayout}
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
            name="account-details"
            validateMessages={null}
            scrollToFirstError
            // initialValues={this.props.account.payload}
          >
            <Form.Item
              key={updateIndex()}
              name="enrollment"
              label="Matrícula"
              hasFeedback
            >
              <Input maxLength="8" disabled bordered={false} />
            </Form.Item>
            <Form.Item
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
            </Form.Item>
            <Form.Item
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
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
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
              <Input placeholder="Correo eléctronico" />
            </Form.Item>
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
        </Content>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAccount: () => dispatch(getAccountDetails()),
  };
};

export default connect(null, mapDispatchToProps)(AccountDetails);
