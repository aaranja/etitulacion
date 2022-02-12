import React, { Component } from "react";
import { Button, Card, Divider, Form, Input } from "antd";
import _ from "lodash";
import * as itemLayout from "../../../../site/pages/Register/ItemLayout";
import MultiSelect from "./MultiSelect";

class FormGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initial: { ...this.props.init },
    };
    this.aepForm = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let isEqual = _.isEqual(prevProps.init, this.props.init);
    if (!isEqual) {
      this.aepForm.current.setFieldsValue(this.props.init);
    }
  }

  render() {
    return (
      <Card
        style={{
          overflow: "inherit",
        }}
      >
        <Card.Meta description="Formulario de generación de acta (Los datos introducidos no se guardarán)" />
        <Form
          initialValues={this.props.init}
          ref={this.aepForm}
          {...itemLayout.form}
          name="aepForm"
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Divider orientation={"left"} type={"horizontal"}>
            Datos del egresado
          </Divider>
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
            <Input />
          </Form.Item>
          <Form.Item name="titulation_type" label="Op. Titulación">
            <Input />
          </Form.Item>
          <Divider orientation={"left"} type={"horizontal"}>
            Datos del instituto
          </Divider>
          <Form.Item name="institute" label="Instituto">
            <Input />
          </Form.Item>
          <Form.Item name="clave" label="Clave">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Ciudad">
            <Input />
          </Form.Item>
          <Form.Item name="today_date" label="Fecha de hoy">
            <Input />
          </Form.Item>
          <Divider orientation={"left"} type={"horizontal"}>
            Datos del personal
          </Divider>
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
          <Divider orientation={"left"} type={"horizontal"} />
        </Form>
        <Form.Item style={{ float: "right" }}>
          <Button htmlType="submit" type="primary" form="aepForm">
            Generar
          </Button>
        </Form.Item>
      </Card>
    );
  }
}

export default FormGeneration;
