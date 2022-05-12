import React, { Component } from "react";
import { Button, Card, Form, Input, Space } from "antd";
import * as actions from "../../../../store/actions/staff";
import { connect } from "react-redux";

const { TextArea } = Input;

class ValidationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notify: false,
    };
  }

  onApproval = (value, type) => {
    this.setState({
      loading: true,
      approval: type === "success",
      notify: type === "error",
    });
    this.props.setApproval(this.props.graduatePK, value, type);
  };

  render() {
    return (
      <>
        <Card.Meta
          description={
            "Escriba un mensaje en el siguiente cuadro en caso de que desee notificar un error en la documentación del egresado."
          }
          style={{ margin: 5 }}
        />
        <Form
          ref={this.form}
          name="approval"
          onFinish={(values) => {
            this.onApproval(values.comment, "error");
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              name="comment"
              key={1}
              rules={[
                {
                  required: true,
                  message: "No puedes dejar este campo vacío.",
                },
              ]}
            >
              <TextArea rows={6} />
            </Form.Item>
            <Space
              direction="horizontal"
              style={{
                float: "right",
              }}
            >
              <Button
                danger
                loading={this.state.loading}
                htmlType="submit"
                form="approval"
              >
                Notificar
              </Button>

              <Button
                type="primary"
                loading={this.state.approval}
                onClick={() => this.onApproval("Trámite aprobado.", "success")}
              >
                Aprobar
              </Button>
            </Space>
          </Space>
        </Form>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setApproval: (enrollment, message, type) =>
      dispatch(actions.setApproval(enrollment, message, type)),
  };
};

export default connect(null, mapDispatchToProps)(ValidationView);
