import React, { Component } from "react";
import { PageHeader, Card, Table } from "antd";
import columns from "./columns";
import GroupDate from "./groupdate";
import { connect } from "react-redux";
import { getDateGroup } from "../../../store/actions/staff";

class InaugurationDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loading: true,
      loadingData: false,
      sidebarSize: 350,
      filters: {
        career: null,
        status: null,
        search: "",
      },
      currentDate: null,
      openAboutDate: false,
      currentAboutDate: {},
      typeAboutDate: null,
      dateGroups: [],
    };
    window.history.pushState(
      "dates/",
      "Toma de protesta",
      `/home/coordination/inauguration-dates/`
    );
  }

  componentDidMount() {
    //  set sider function
    this.props.setSiderProps({ addNewDate: this.onAddNewGroupDate });
    //  get all date groups
    this.props.getAllDateGroups();
  }

  // componentWillUnmount() {
  //   console.log("adios mundo cruel 2");
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.loading !== prevProps.loading && !this.props.loading) {
      this.setState({
        dateGroups: this.props.dateGroups,
        loading: false,
      });
    }
  }

  onShowGroupDate = (values, actiontype) => {
    //  get the specific graduates on this group
    if (actiontype === "info") {
      this.props.getDateGroup(values.id);
    }
    this.setState({
      currentAboutDate: values,
      openAboutDate: true,
      typeAboutDate: actiontype,
    });
  };

  onAddNewGroupDate = () => {
    let values = { id: null, dataSource: {} };
    this.onShowGroupDate(values, "create");
  };

  onDeleteGroup = (id) => {
    let dateGroups = this.state.dateGroups;
    console.log(dateGroups);
    for (let i in dateGroups) {
      if (dateGroups[i].id === id) {
        dateGroups = dateGroups.splice(i, 1);
        console.log(dateGroups);
        break;
      }
    }
    this.setState({
      openAboutDate: false,
      typeAboutDate: null,
      currentAboutDate: [],
      dateGroups: dateGroups,
    });
  };

  onSaved = (group) => {
    let dateGroups = this.state.dateGroups;
    let type = this.state.typeAboutDate;
    if (type === "create") {
      //  add new group into the table
      group.key = group.id;
      dateGroups.push(group);
      this.setState({
        typeAboutDate: "info",
        currentAboutDate: group,
        dateGroups: dateGroups,
      });
    } else if (type === "info") {
      //  replace group with id
      for (let val in dateGroups) {
        // find and replace group with the same id
        if (dateGroups[val].id === group.id) {
          group.key = group.id;
          dateGroups[val] = group;
          break;
        }
      }
      this.setState({
        typeAboutDate: "created",
        currentAboutDate: group,
        dateGroups: dateGroups,
      });
    }
  };

  render() {
    return (
      <>
        <PageHeader ghost={false} title="Fechas de toma de protesta" />
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
            loading={this.props.loading}
            columns={columns(this.onShowGroupDate)}
            dataSource={[...this.state.dateGroups]}
            style={{ height: "100%", width: "100%" }}
          />
          <GroupDate
            callBack={this.props.callBack}
            showInfo={this.onShowGroupDate}
            type={this.state.typeAboutDate}
            dataSource={this.state.currentAboutDate}
            visible={this.state.openAboutDate}
            delete={this.onDeleteGroup}
            saved={this.onSaved}
            disable={() => {
              this.setState({
                openAboutDate: false,
                typeAboutDate: null,
                currentAboutDate: [],
              });
            }}
          />
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let dateGroups = [];
  if (state.staff.payload !== null) {
    if (state.staff.payload.dateGroups !== undefined) {
      dateGroups = state.staff.payload.dateGroups;
      for (let index in dateGroups) {
        dateGroups[index].key = dateGroups[index].id;
      }
    }
  }

  return {
    loading: state.staff.loading,
    dateGroups: dateGroups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDateGroups: () => {
      dispatch(getDateGroup("all"));
    },
    getDateGroup: (id) => {
      dispatch(getDateGroup(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InaugurationDate);
