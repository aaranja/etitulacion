import React, { Component } from "react";
import { Input, Select } from "antd";
import _ from "lodash";
import { staffStructureOptions } from "../../../ARPProtocol/ARPForm/selectOptions";

export default class MultiSelect extends Component {
  constructor(props) {
    super(props);

    let options = {};
    options.id_card = staffStructureOptions(
      this.props.dataSource,
      this.props.type,
      "id_card"
    );
    options.full_name = staffStructureOptions(
      this.props.dataSource,
      this.props.type,
      "full_name"
    );
    options.career = staffStructureOptions(
      this.props.dataSource,
      this.props.type,
      "profession"
    );
    this.state = {
      value: this.props.value,
      options: options,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let isEqual = _.isEqual(prevProps.value, this.props.value);
    if (!isEqual) {
      this.setNewFormValue(this.props.value);
    }
  }

  setNewFormValue = (value) => {
    let newValue = { [this.props.type + "_id"]: value };
    this.props.form.current.setFieldsValue(newValue);
    this.setState({ value: value });
  };

  render() {
    return (
      <Input.Group compact>
        <Select
          showSearch
          placeholder="Cédula"
          value={this.state.value}
          optionFilterProp="children"
          onChange={(value) => {
            this.setNewFormValue(value);
          }}
          filterOption={(input, option) => {
            return (
              option.label
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
          options={this.state.options.id_card}
        />

        <Select
          showSearch
          placeholder="Nombre"
          value={this.state.value}
          style={{ width: "100%" }}
          optionFilterProp="children"
          filterOption={(input, option) => {
            return (
              option.label
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
          options={this.state.options.full_name}
          onChange={(value) => {
            this.setNewFormValue(value);
          }}
        />
        <Select
          dropdownRender={null}
          bordered={false}
          showSearch
          placeholder="Profesión"
          value={this.state.value}
          style={{
            width: "100%",
          }}
          optionFilterProp="children"
          filterOption={(input, option) => {
            return (
              option.label
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
          options={this.state.options.career}
          onChange={(value) => {
            this.setNewFormValue(value);
          }}
        />
      </Input.Group>
    );
  }
}
