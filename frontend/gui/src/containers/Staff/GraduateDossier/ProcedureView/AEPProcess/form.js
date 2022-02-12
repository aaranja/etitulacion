import React, { Component } from "react";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Steps,
} from "antd";
import {
  DownloadOutlined,
  ReadOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as itemLayout from "../../../../../site/pages/Register/ItemLayout";
import MultiSelect from "../../../AEProfessional/AEPGeneration/MultiSelect";
import { careerOptions } from "../../../../../site/collections/careerTypes";

const { Step } = Steps;

class AEPForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
    this.aepForm = React.createRef();
  }

  onChange = (current) => {
    this.setState({ current });
  };

  render() {
    return (
      <div style={{}}>
        <Card.Meta description="Generar carta de examen profesional" />
        <Steps
          type="navigation"
          size="small"
          onChange={this.onChange}
          current={this.state.current}
        >
          <Step title="Egresado" icon={<UserOutlined />} />
          <Step title="Libro" icon={<ReadOutlined />} />
          <Step title="Instituto" icon={<ReadOutlined />} />
          <Step title="Personal" icon={<SolutionOutlined />} />
        </Steps>

        <Form
          {...itemLayout.form}
          name="aepForm"
          ref={this.aepForm}
          initialValues={this.props.dataSource}
          onFinish={this.props.onFinish}
        >
          <Card
            bordered={false}
            style={{
              display: this.state.current === 0 ? "block" : "none",
              justifyContent: "center",
              width: "80%",
              height: 360,
            }}
          >
            <Form.Item name="enrollment" label="No. Control">
              <Input />
            </Form.Item>
            <Form.Item name="first_name" label="Nombre(s)">
              <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Apellidos">
              <Input />
            </Form.Item>
            <Form.Item name="career" label="Carrera">
              <Select options={careerOptions} />
            </Form.Item>
            <Form.Item name="titulation_type" label="Opc. Titulación">
              <Input />
            </Form.Item>
          </Card>
          <Card
            bordered={false}
            style={{
              display: this.state.current === 1 ? "block" : "none",
              justifyContent: "center",
              width: "80%",
              height: 360,
            }}
          >
            <Form.Item name="record_id" label="No. Libro">
              <Input />
            </Form.Item>
            <Form.Item name="record_page" label="No. foja">
              <Input />
            </Form.Item>
            <Form.Item name="a" label="Fecha autorización">
              <DatePicker />
            </Form.Item>
          </Card>
          <Card
            bordered={false}
            style={{
              display: this.state.current === 2 ? "block" : "none",
              justifyContent: "center",
              width: "80%",
              height: 360,
            }}
          >
            <Form.Item name="institute" label="Instituto">
              <Input />
            </Form.Item>
            <Form.Item name="clave" label="Clave">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="Ciudad">
              <Input />
            </Form.Item>
            <Form.Item name="a" label="Fecha A. Protocolario">
              <DatePicker />
            </Form.Item>
          </Card>
          <Card
            bordered={false}
            style={{
              display: this.state.current === 3 ? "block" : "none",
              justifyContent: "center",
              width: "80%",
              height: 360,
            }}
          >
            <Form.Item name="president_id" label="Presidente">
              <MultiSelect
                dataSource={this.props.staffData.arpStaff}
                type="president"
                form={this.aepForm}
              />
            </Form.Item>

            <Form.Item name="secretary_id" label="Secretario">
              <MultiSelect
                dataSource={this.props.staffData.arpStaff}
                type="secretary"
                form={this.aepForm}
              />
            </Form.Item>
            <Form.Item name="vocal_id" label="Vocal">
              <MultiSelect
                dataSource={this.props.staffData.arpStaff}
                type="vocal"
                form={this.aepForm}
              />
            </Form.Item>
          </Card>
          <Divider />
          <Form.Item style={{ float: "right" }}>
            <Button
              loading={this.props.generating}
              htmlType="submit"
              type="secondary"
              form="aepForm"
              icon={<DownloadOutlined />}
            >
              Generar Acta
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default AEPForm;
