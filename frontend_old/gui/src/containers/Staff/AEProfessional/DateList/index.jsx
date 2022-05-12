import React, { Component } from "react";
import { Table } from "antd";
import columns from "./columns";
import { connect } from "react-redux";
import { getARPGroupsServices } from "../../../../store/actions/staff";

class DateList extends Component {
  constructor(props) {
    super(props);
    this.props.getARPGroups();
  }

  onGetDate = (value) => {
    this.props.callBack("aepliberation", value.id);
  };

  render() {
    return (
      <Table
        columns={columns(this.onGetDate)}
        dataSource={this.props.arpGroups}
      />
    );
  }
}

const mapStateToProps = (state) => {
  let arpGroups = [];
  let dataStaff = state.dataStaff;

  if (dataStaff.payload["arpGroups"] !== undefined) {
    arpGroups = dataStaff.payload["arpGroups"].data;
  }

  return {
    arpGroups: arpGroups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getARPGroups: () => dispatch(getARPGroupsServices()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DateList);
