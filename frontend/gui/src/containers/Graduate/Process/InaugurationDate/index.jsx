import React, { Component } from "react";
import { Card, Descriptions, Divider, Layout, Space, Table, Tag } from "antd";
import { connect } from "react-redux";
import { Typography } from "antd/es";
import { arpRowRender } from "./arpTable";
import { accountGetARPInfo } from "../../../../store/actions/account";
import moment from "moment";
import careerTypes from "../../../../site/collections/careerTypes";

class InaugurationDate extends Component {
  componentDidMount() {
    this.props.getARPInfo();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.dateInfo !== null) {
      this.props.enableNext(this.props.dateInfo.confirmed);
    }
  }

  goNext = () => {
    return true;
  };

  render() {
    const columns = [
      {
        title: "No. Control",
        dataIndex: "enrollment",
        key: "enrollment",
      },
      { title: "Nombre(s)", dataIndex: "first_name", key: "first_name" },
      { title: "Apellidos", dataIndex: "last_name", key: "last_name" },
      {
        title: "Carrera",
        dataIndex: "career",
        key: "last_name",
        render: (item) => careerTypes[item],
      },
      { title: "Correo", dataIndex: "email", key: "last_name" },
      { title: "No. Celular", dataIndex: "cellphone", key: "last_name" },
    ];
    return (
      <Layout style={{ backgroundColor: "white" }}>
        <Descriptions
          size="middle"
          column={1}
          style={{ marginLeft: 60, marginRight: 120 }}
        >
          <Descriptions.Item label={<b>INSTRUCCIONES</b>}>
            Coordinación de titulación le asignará la fecha de toma de protesta
          </Descriptions.Item>
        </Descriptions>
        {this.props.dateInfo !== null ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: 30,
            }}
          >
            <Card style={{ flex: 2 }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Fecha">
                  {this.props.dateInfo.date !== null ? (
                    moment(this.props.dateInfo.date).format(
                      " dddd DD [de] MMMM [de] YYYY | [Hora:] HH:mm"
                    )
                  ) : (
                    <p>Sin fecha asignada</p>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Asistencia">
                  {this.props.dateInfo["confirmed"] ? (
                    <Tag color={"#87d068"}>Confirmada</Tag>
                  ) : (
                    <Tag>Sin confirmar</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Datos ARP" />
              </Descriptions>
              <Table
                columns={columns}
                pagination={false}
                defaultExpandedRowKeys={[this.props.dateInfo["arpData"].key]}
                expandable={{
                  expandedRowRender: (record) =>
                    this.props.dateInfo["arp_generated"] ? (
                      <>
                        <Space direction="vertical">
                          <Typography.Text>
                            Instituto: {record["institute"]}
                          </Typography.Text>
                          <Divider style={{ margin: 0 }} />
                          <Typography.Text>
                            Opción titulación: {record["titulation_type"]}
                          </Typography.Text>
                          <Divider style={{ margin: 0 }} />{" "}
                          <Typography.Text>
                            Titulo trabajo: {record["project_name"]}
                          </Typography.Text>
                          <Divider style={{ margin: 0 }} />{" "}
                          <Typography.Text>
                            Asesor interno: {record["int_assessor_name"]}
                          </Typography.Text>
                          <Divider style={{ margin: 0 }} />{" "}
                          <Typography.Text>Rubricantes:</Typography.Text>
                        </Space>
                        {arpRowRender(record["staffData"])}
                      </>
                    ) : (
                      <Typography.Text italic>Sin información</Typography.Text>
                    ),
                  rowExpandable: (record) => record.name !== "Not Expandable",
                }}
                dataSource={[this.props.dateInfo["arpData"]]}
              />
            </Card>
          </div>
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  let dateInfo = null;
  if (state.account.payload !== undefined) {
    if (state.account.payload["dateInfo"] !== undefined) {
      dateInfo = state.account.payload["dateInfo"];
      console.log(dateInfo);
    }
  }
  return {
    dateInfo: dateInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getARPInfo: () => {
      dispatch(accountGetARPInfo());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(InaugurationDate);
