import React, { Component } from "react";
import { PageHeader, Table, Descriptions, Tag, Card } from "antd";
import { columns } from "./columns";
import { connect } from "react-redux";
import {
  getAEPGroupsServices,
  getARPStaff2,
} from "../../../../store/actions/staff";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { withRouter } from "../../../../routes/withRouter";

class AEPGeneration extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    window.history.pushState(
      "aep-liberation/",
      "Liberación de acta de examen profesional",
      `/home/services/aep-liberation/${this.props.initialData}/`
    );
    // get list of approved date groups
    this.props.getAEPGroups(this.props.initialData);
    // get arp staff data

    this.props.getARPStaff();

    this.state = {
      selectedGraduate: null,
    };
  }

  render() {
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <PageHeader
          onBack={() => {
            this.props.callBack("aeprofesional", null);
          }}
          title="Grupo "
        />

        {!this.props.loadingGet ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              marginLeft: 20,
              marginRight: 20,
              flexDirection: "column",
            }}
          >
            <Descriptions column={1}>
              <Descriptions.Item label="ID" labelStyle={{ fontWeight: "bold" }}>
                {this.props.aepData.date.id}
              </Descriptions.Item>
              <Descriptions.Item
                label="Fecha"
                labelStyle={{ fontWeight: "bold" }}
              >
                {moment(this.props.aepData.date["date"]).format(
                  "DD [de] MMMM [de] YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label="Asistencia"
                labelStyle={{ fontWeight: "bold" }}
              >
                {this.props.aepData.date["confirmed"] ? (
                  <Tag color={"#87d068"}>Confirmada</Tag>
                ) : (
                  <Tag>Sin confirmar</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label="Egresados"
                labelStyle={{ fontWeight: "bold" }}
              />
            </Descriptions>
            <Table
              size="middle"
              bordered={true}
              pagination={false}
              columns={columns(this.props.staffData)}
              rowClassName={"graduate-row-table"}
              dataSource={this.props.aepData.graduateList}
              scroll={{ x: 1000 }}
            />
          </div>
        ) : (
          <LoadingOutlined />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let loadingGet = true;
  let data = state.dataStaff.payload;
  let aepData = [];
  let staffData = [];
  let loadingARPStaff = true;
  if (data["aepGroup"] !== undefined) {
    aepData = data["aepGroup"].data;
    if (
      data["aepGroup"].status === "success" &&
      data["aepGroup"].action === "get"
    ) {
      loadingGet = false;
    }
  }

  if (data["arpStaff"] !== undefined) {
    staffData = data["arpStaff"].data;
    if (
      data["arpStaff"].status === "success" &&
      data["arpStaff"].action === "get"
    ) {
      loadingARPStaff = false;
    }
  }

  return {
    loadingGet: loadingGet,
    aepData: aepData,
    loadingStaff: loadingARPStaff,
    staffData: staffData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAEPGroups: (id) => {
      dispatch(getAEPGroupsServices(id));
    },
    getARPStaff: () => {
      dispatch(getARPStaff2());
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AEPGeneration)
);
