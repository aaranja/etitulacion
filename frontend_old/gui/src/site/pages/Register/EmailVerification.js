import React, { Component } from "react";
import { Button, Card, Divider, Form, Space, Typography } from "antd";
import Timer from "react-compound-timerv2";
import ReactCodeInput from "react-code-input";
import { connect } from "react-redux";
import { sendEmailVerification } from "../../../store/actions/services";
import {
  MailTwoTone,
  SmileTwoTone,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      validating: false,
      enableConfirm: false,
      confirmed: false,
    };
    this.form = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { status, action } = this.props;
    const { validating } = this.state;
    if (validating && action === "post") {
      const prevLoad = prevProps.status === "loading";
      if (status === "success" && prevLoad) {
        this.setState({
          validating: false,
          confirmed: true,
        });
      } else {
        if (status === "failure" && prevLoad) {
          const { error } = this.props;
          this.setFormErrors(error.response.data);
          this.setState({
            validating: false,
            confirmed: false,
          });
        }
      }
    }
  }

  onFinish = (values) => {
    this.setState({
      validating: true,
    });
    this.props.sendCode({ code: values.code, email: this.props.email });
  };

  setFormErrors = (errors) => {
    let data = [];
    for (let entry in errors) {
      data.push({ name: entry, errors: errors[entry] });
    }
    this.form.current.setFields(data);
  };

  render() {
    const { email } = this.props;
    const { confirmed } = this.state;
    return (
      <Card style={{ textAlign: "center" }}>
        {!confirmed ? (
          <>
            <Title>Completar registro en ETITULACIÓN</Title>
            <MailTwoTone style={{ fontSize: 60, marginBottom: "20px" }} />
            <Paragraph>
              Se ha enviado por correo electrónico a{" "}
              <Text underline>{email}</Text> el código para confirmar su
              registro.
            </Paragraph>
            <Paragraph>
              Para continuar, introduzca el código de confirmación de 6 dígitos
              en el siguiente campo:
            </Paragraph>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Form
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                ref={this.form}
                layout="vertical"
                onFinish={this.onFinish}
              >
                <Form.Item
                  label="Código: "
                  name="code"
                  extra={[
                    <Text key={1} type="secondary">
                      Tiempo restante:{" "}
                    </Text>,
                    <Timer key={2} initialTime={555000} direction="backward">
                      {() => (
                        <React.Fragment>
                          <Timer.Minutes />
                          m:
                          <Timer.Seconds />s
                        </React.Fragment>
                      )}
                    </Timer>,
                  ]}
                >
                  <ReactCodeInput
                    onChange={(value) => {
                      if (value.length >= 6) {
                        this.setState({ enableConfirm: true });
                      } else {
                        if (this.state.enableConfirm) {
                          this.setState({ enableConfirm: false });
                        }
                      }
                    }}
                    initialFocus={true}
                    type="number"
                    fields={6}
                    inputMode="numeric"
                    name="code-verification"
                  />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      disabled={!this.state.enableConfirm}
                      type="primary"
                      loading={this.state.validating}
                      htmlType="submit"
                    >
                      Confirmar
                    </Button>
                    <Button type="link">Volver a enviar el código</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </>
        ) : (
          <>
            <Title>Registro exitoso</Title>
            <SmileTwoTone style={{ fontSize: 60, marginBottom: "20px" }} />
            <Paragraph>
              Tu cuenta ha sido creada exitosamente. En unos momentos se te
              redirigirá a la pagina de inicio.
            </Paragraph>
            <Divider />
          </>
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  let status = null;
  let error = null;
  let action = null;
  if (state.services.payload["econfirmation"] !== undefined) {
    const { econfirmation } = state.services.payload;
    status = econfirmation.status;
    error = econfirmation.error;
    action = econfirmation.action;
  }
  return {
    status: status,
    error: error,
    action: action,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendCode: (values) => {
      dispatch(sendEmailVerification(values));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);
