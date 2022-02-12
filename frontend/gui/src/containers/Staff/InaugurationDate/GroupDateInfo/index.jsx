import React, { Component } from "react";
import { Button, Descriptions, Divider, Table } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { PlusSquareOutlined } from "@ant-design/icons";
import careerTypes from "../../../../site/collections/careerTypes";

class GroupDateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.loading !== prevProps.loading && !this.props.loading) {
      this.setState({
        tableData: this.props.dateGroupInfo,
      });
    }
  }

  render() {
    const columns = [
      {
        title: "Matrícula",
        dataIndex: "enrollment",
        key: "enrollment",
        width: 100,
      },
      {
        title: "Nombre(s)",
        dataIndex: "first_name",
        key: "first_name",
      },
      {
        title: "Apellidos",
        dataIndex: "last_name",
        key: "last_name",
      },
      {
        title: "Carrera",
        dataIndex: "career",
        key: "career",
        render: (record) => {
          return <p style={{ margin: "auto" }}>{careerTypes[record]}</p>;
        },
      },
      {
        title: "",
        dataIndex: "more",
        key: "more",
        render: (key, data) => {
          return (
            <Button
              icon={<PlusSquareOutlined />}
              type="text"
              target="_blank"
              href={`http://localhost:3000/home/documents/${data.enrollment}`}
            />
          );
        },
      },
    ];

    return (
      <div style={{ margin: 10 }}>
        <Descriptions size="large" column={1} style={{ margin: 25 }}>
          <Descriptions.Item
            label="ID"
            labelStyle={{ fontSize: 14, fontWeight: "bold" }}
          >
            {this.props.initialData.id}
          </Descriptions.Item>
          <Descriptions.Item
            label="Fecha"
            labelStyle={{ fontSize: 14, fontWeight: "bold" }}
          >
            {moment(this.props.initialData.date).format(
              "DD [de] MMMM [de] YYYY"
            )}
          </Descriptions.Item>
        </Descriptions>
        <Divider>Egresados</Divider>
        <Table
          pagination={false}
          columns={columns}
          dataSource={this.props.dateGroupInfo}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let loading = true;
  let dateGroupInfo = [];
  if (state.staff.payload !== null) {
    if (state.staff.payload.dateGroupInfo !== undefined) {
      loading = false;
      dateGroupInfo = state.staff.payload.dateGroupInfo;
      for (let index in dateGroupInfo) {
        dateGroupInfo[index].key = dateGroupInfo[index].enrollment;
      }
    }
  }
  return {
    loading: loading,
    dateGroupInfo: dateGroupInfo,
  };
};

export default connect(mapStateToProps, null)(GroupDateInfo);
