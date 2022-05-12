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
    console.log(props.dataSource);
    this.aepForm = React.createRef();
  }

  onChange = (current) => {
    this.setState({ current });
  };

  render() {
    const rules = () => {
      return [
        {
          required: true,
          message: "Por favor introduce este campo!",
        },
      ];
    };
    return (
      <div>
        <Card.Meta description="Generar acta de examen profesional" />
        <Steps
          type="navigation"
          size="small"
          onChange={this.onChange}
          current={this.state.current}
        >
          <Step title="Egresado" icon={<UserOutlined />} />
          <Step title="Libro" icon={<ReadOutlined />} />
          <Step title="Instituto" icon={<ReadOutlined />} />
          <Step title="Rubricantes" icon={<SolutionOutlined />} />
        </Steps>

        <Form
          {...itemLayout.form}
          name="aepForm"
          ref={this.aepForm}
          initialValues={this.props.dataSource}
          onFinish={this.props.onFinish}
        >
          <Card
            style={{
              display: this.state.current === 0 ? "block" : "none",
              justifyContent: "center",
              height: 370,
            }}
          >
            <div style={{ width: "80%" }}>
              <Form.Item name="enrollment" label="No. Control" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item name="first_name" label="Nombre(s)" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item name="last_name" label="Apellidos" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item name="career" label="Carrera" rules={rules()}>
                <Select options={careerOptions} />
              </Form.Item>
              <Form.Item
                name="titulation_type"
                label="Opc. Titulación"
                rules={rules()}
              >
                <Input />
              </Form.Item>
              <Form.Item name="date" label="Fecha de ARP" rules={rules()}>
                <DatePicker />
              </Form.Item>
            </div>
          </Card>
          <Card
            style={{
              display: this.state.current === 1 ? "block" : "none",
              justifyContent: "center",
              height: 370,
            }}
          >
            <div style={{ width: "80%" }}>
              <Form.Item name="record_book" label="No. Libro" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item name="record_page" label="No. foja" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item
                name="record_date"
                label="Fecha autorización"
                rules={rules()}
                hasFeedback={true}
              >
                <DatePicker />
              </Form.Item>
            </div>
          </Card>
          <Card
            style={{
              display: this.state.current === 2 ? "block" : "none",
              justifyContent: "center",
              height: 370,
            }}
          >
            <div style={{ width: "80%" }}>
              <Form.Item name="institute" label="Instituto" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item name="code" label="Clave" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item name="city" label="Ciudad" rules={rules()}>
                <Input />
              </Form.Item>
              <Form.Item
                name="services_lead"
                label="Jefe(a) S.E."
                rules={rules()}
              >
                <Input />
              </Form.Item>
              <Form.Item name="director" label="Director" rules={rules()}>
                <Input />
              </Form.Item>
            </div>
          </Card>
          <Card
            style={{
              display: this.state.current === 3 ? "block" : "none",
              justifyContent: "center",
              height: 370,
            }}
          >
            <div style={{ width: "80%" }}>
              <Form.Item name="president_id" label="Presidente" rules={rules()}>
                <MultiSelect
                  dataSource={this.props.staffData.arpStaff}
                  type="president"
                  form={this.aepForm}
                />
              </Form.Item>

              <Form.Item name="secretary_id" label="Secretario" rules={rules()}>
                <MultiSelect
                  dataSource={this.props.staffData.arpStaff}
                  type="secretary"
                  form={this.aepForm}
                />
              </Form.Item>
              <Form.Item name="vocal_id" label="Vocal" rules={rules()}>
                <MultiSelect
                  dataSource={this.props.staffData.arpStaff}
                  type="vocal"
                  form={this.aepForm}
                />
              </Form.Item>
            </div>
          </Card>
          <Form.Item style={{ float: "right", marginTop: 10 }} rules={rules()}>
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
