import React, { Component } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/staff";
import columns from "./columns";
import "./graduateTable.css";

/* class to show the process of each graduate in a table, used by coordination and schools services*/
class GraduateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loading: false,
      loadingData: false,
      loadingList: false,
      filters: { career: null, status: null, search: "" },
      sidebarSize: 350,
    };
    this.props.getGraduateList();
  }

  componentDidMount() {
    this.props.setSiderProps({
      setFilters: this.getFilter,
    });
  }

  getFilter = (values) => {
    this.setState({
      filters: values,
    });
    if (
      values.career !== null ||
      values.status !== null ||
      values.search !== ""
    )
      this.props.getFilteredList(values);
    else {
      this.props.getGraduateList();
    }
  };

  onCollapse = (collapsed) => {
    let size = 350;
    if (collapsed) size = 0;
    this.setState({
      sidebarSize: size,
    });
  };

  render() {
    // let subtitle = "";
    // const career = this.state.filters.career;
    // const search = this.state.filters.search;
    // if (career !== null) {
    //   subtitle = careerTypes[career];
    //   if (search !== "") {
    //     subtitle += ": ";
    //   }
    // }
    //
    // subtitle += search;
    return (
      <>
        <Table
          pagination={false}
          rowClassName={() => "graduate-row"}
          bordered
          dataSource={this.props.dataSource}
          columns={columns(this.props.user)}
          onRow={(record) => {
            return {
              onClick: () => {
                this.props.callBack("dossier", record.enrollment);
              }, // click row
            };
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let dataSource = [];
  if (!state.staff.loading && state.staff.payload !== null) {
    // set an unique key to each data row
    let graduatelist = state.staff.payload.tableData;
    for (const key in graduatelist) {
      graduatelist[key].key = key;
    }
    dataSource = graduatelist;
  }

  return {
    loading: state.staff.loading,
    dataSource: dataSource,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGraduateList: () => dispatch(actions.getGraduateList()),
    getFilteredList: (filters) => dispatch(actions.getFilteredList(filters)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraduateTable);
