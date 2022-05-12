import React, { Component } from "react";
import { Form, DatePicker } from "antd";
import { columns } from "../columnsGraduateTable";
import TableTransfer from "../../../../components/TableTransfer";
import { connect } from "react-redux";
import { getFilteredList } from "../../../../store/actions/staff";
import moment from "moment";
import "moment/locale/es-mx";

class GroupDateForm extends Component {
  constructor(props) {
    super(props);
    let initialData = this.props.initialData;
    let targetKeys = [];
    let dataSource = [];
    let selectedDate = null;
    let formType = "create";
    let id = null;
    if (initialData !== null) {
      let formData = initialData.formData;
      for (let i in formData.groupGraduate) {
        targetKeys.push(formData.groupGraduate[i].key);
      }
      dataSource = formData.groupGraduate;
      selectedDate = moment(formData.groupInfo.date);
      formType = "update";
      id = formData.groupInfo.id;
    }

    this.state = {
      // keys which has been selected
      id: id,
      selectedDate: selectedDate,
      oldTargetKeys: targetKeys,
      targetKeys: targetKeys,
      dataSource: dataSource,
      formType: formType,
    };
  }

  componentDidMount() {
    //  get graduate to date when form is mounted
    this.props.getGraduateToDate();
  }

  componentWillUnmount() {
    console.log("adios mundo cruel");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.loading !== prevProps.loading && !this.props.loading) {
      //    loading is changed and false
      let current_dataSource = this.state.dataSource;
      this.props.dataSource.map((value) => {
        value.key = value.enrollment.toString();
        current_dataSource.push(value);
        return null;
      });

      this.setState({
        dataSource: current_dataSource,
      });
    }
  }

  onTransferChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onSave = (values) => {
    let type = this.state.formType;
    if (type === "update") {
      let toRemove = [];
      let previous = this.state.oldTargetKeys;
      //  if it is a update, get the graduate to remove date
      for (let i in previous) {
        if (!values.graduateList.find((element) => element === previous[i])) {
          toRemove.push(previous[i]);
        }
      }

      values.toRemove = toRemove;
      values.id = this.state.id;
    }
    this.props.onSaveGroupDate(values, type);
  };

  render() {
    return (
      <Form
        onFinish={this.onSave}
        name="group-date-form"
        layout="vertical"
        style={{ margin: 10 }}
      >
        <Form.Item
          label="Fecha"
          id="date"
          name="date"
          initialValue={this.state.selectedDate}
          rules={[
            {
              required: true,
              message: "Por favor seleccione una fecha.",
            },
          ]}
        >
          <DatePicker placeholder="Seleccionar fecha" format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item
          label="Seleccionar egresados"
          name="graduateList"
          initialValue={this.state.targetKeys}
          rules={[
            {
              required: true,
              message: "Por favor seleccione al menos un egresado.",
            },
          ]}
        >
          <TableTransfer
            dataSource={this.state.dataSource}
            targetKeys={this.state.targetKeys}
            disabled={false}
            showSearch={true}
            onChange={this.onTransferChange}
            filterOption={(inputValue, item) => {
              console.log(inputValue);
              console.log(item);
              return (
                item.key.indexOf(inputValue) !== -1 ||
                item.first_name.indexOf(inputValue) !== -1
              );
            }}
            leftColumns={columns}
            rightColumns={columns}
          />
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  let loading = true;
  let dataSource = [];
  if (state.staff.payload !== null && !state.staff.loading) {
    loading = false;
    dataSource = state.staff.payload.tableData;
  }

  return {
    loading: loading,
    dataSource: dataSource,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGraduateToDate: () => {
      let filters = {
        career: null,
        status: "STATUS_10",
        search: "",
      };
      dispatch(getFilteredList(filters));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDateForm);
