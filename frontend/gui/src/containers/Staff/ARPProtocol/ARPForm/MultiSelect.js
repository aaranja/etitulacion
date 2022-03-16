import React, {Component} from "react";
import {Button, Input, Select} from "antd";
import {staffStructureOptions} from "./selectOptions";

export default class MultiSelect extends Component {
    constructor(props) {
        super(props);
        let options = {};
        options.id_card = staffStructureOptions(
            this.props.dataSource,
            "id_card"
        );
        options.full_name = staffStructureOptions(
            this.props.dataSource,
            "full_name"
        );
        console.log(options)
        this.state = {
            value: null,
            options: options,
        };
    }

    render() {
        return (
            <Input.Group compact>
                <Select
                    showSearch
                    placeholder="Cédula"
                    value={this.state.value}
                    optionFilterProp="children"
                    onChange={(value) => {
                        this.setState({value: value});
                    }}
                    filterOption={(input, option) => {
                        return (
                            option.label
                                .toString()
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        );
                    }}
                    onBlur={() => {
                        console.log("aaaaaaaa");
                    }}
                    options={this.state.options.id_card}
                />
                <Select
                    showSearch
                    placeholder="Nombre"
                    value={this.state.value}
                    style={{width: 200}}
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
                        this.setState({value: value});
                    }}
                />
                <Button
                    type="primary"
                    htmlType={"submit"}
                    form="select-staff"
                    disabled={this.state.value === null}
                    onClick={() => {
                        this.props.onFinish(this.state.value);
                    }}
                >
                    Asignar
                </Button>
            </Input.Group>
        );
    }
}
