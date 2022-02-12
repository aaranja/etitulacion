import React, { Component } from "react";
import { Card, PageHeader, Table } from "antd";
import columns from "./columns";
import ARPForm from "./ARPForm";
import ARPStaff from "./ARPStaff";
import { connect } from "react-redux";
import { getARPGroups } from "../../../store/actions/staff";
import _ from "lodash";

class ARPProtocol extends Component {
  constructor(props) {
    super(props);
    // load initial data
    let formType = "update";
    let formVisible = false;
    let initialData = this.props.initialData;
    if (initialData !== null) {
      formType = "create";
      formVisible = true;
    } else {
      initialData = {};
      initialData["id"] = null;
    }
    window.history.pushState(
      "arp-groups/",
      "Acto de recepción profesional ",
      `/home/coordination/arp-dates/`
    );

    this.state = {
      initialData: initialData,
      formVisible: formVisible,
      formType: formType,
      arpStaff: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let notsame = !_.isEqual(this.props.initialData, prevProps.initialData);
    if (notsame) {
      this.setState({
        initialData: this.props.initialData,
      });
    }
  }

  componentDidMount() {
    this.props.setSiderProps({
      on: this.onVisibleForm,
      addARPStaff: this.addARPStaff,
    });
    this.props.getARPGroups();
  }

  onShowARPGroup = (arpData) => {
    this.setState({
      initialData: arpData,
      formVisible: true,
      formType: "update",
    });
  };

  addARPStaff = () => {
    //    show form to add arp personal
    this.onShowARPStaff(true);
  };

  onVisibleForm = (type) => {
    this.setState({
      formVisible: type,
    });
  };

  onShowARPStaff = (value) => {
    this.setState({
      arpStaff: value,
    });
  };

  onDelete = () => {
    this.props.getARPGroups();
    this.setState({
      formVisible: false,
    });
  };

  render() {
    return (
      <>
        <PageHeader ghost={false} title="Acto de recepción profesional" />
        <Card
          bordered={false}
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minHeight: "70vh",
          }}
        >
          <Table
            bordered={true}
            key={"arp-list"}
            loading={this.props.loading}
            columns={columns(this.onShowARPGroup)}
            dataSource={[...this.props.arpGroups]}
            style={{ height: "100%", width: "100%" }}
          />
          {this.state.formVisible ? (
            <ARPForm
              key={"arp-form"}
              create={false}
              type={this.state.formType}
              visible={this.state.formVisible}
              onClose={this.onVisibleForm}
              onDelete={this.onDelete}
              initialData={this.state.initialData}
            />
          ) : null}
          <ARPStaff visible={this.state.arpStaff} show={this.onShowARPStaff} />
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let loading = true;
  let arpGroups = [];
  const payload = state.staff.payload;
  if (payload !== undefined && payload !== null) {
    if (state.staff.payload["arpGroups"] !== undefined) {
      loading = false;
      arpGroups = state.staff.payload["arpGroups"];
      for (let i in arpGroups) {
        arpGroups[i]["key"] = i;
      }
    }
  }

  return {
    loading: loading,
    arpGroups: arpGroups,
    error: state.staff.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getARPGroups: () => {
      dispatch(getARPGroups());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ARPProtocol);
