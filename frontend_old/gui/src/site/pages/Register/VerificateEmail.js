import React, { Component } from "react";
import { Button, Form, Modal, Space, Typography } from "antd";
import ReactCodeInput from "react-code-input";
import Timer from "react-compound-timerv2";
import { connect } from "react-redux";
import { sendEmailVerification } from "../../../store/actions/services";

const { Title, Text } = Typography;

class VerificateEmail extends Component {
  constructor(props) {
    super(props);
    this.state = { code: "", enableConfirm: false };
    this.form = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.enable) {
      //    get account verification status
      this.props.sendVerificationMail();
    }
  }

  render() {
    let email = "al16760256@ite.edu.mx";
    return (
      <Modal
        visible={this.props.enable}
        footer={null}
        closable={false}
        onCancel={() => {
          this.props.cancel(false);
        }}
      >
        <Title level={4}>Verificación de correo institucional</Title>
        <Typography.Paragraph>
          Se ha envíado un código de verificación a su correo electrónico:
          <Text code>{email}</Text>.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Introduzca el código proporcionado en el siguiete campo para poder
          continuar su proceso de titulación.
        </Typography.Paragraph>
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
                <Button disabled={!this.state.enableConfirm} type="primary">
                  Confirmar
                </Button>
                <Button type="link">Volver a enviar el código</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendVerificationMail: () => {
      dispatch(sendEmailVerification());
    },
    sendCode: (code) => {
      dispatch();
    },
    resendVerificationMail: () => {},
  };
};

export default connect(null, mapDispatchToProps)(VerificateEmail);
