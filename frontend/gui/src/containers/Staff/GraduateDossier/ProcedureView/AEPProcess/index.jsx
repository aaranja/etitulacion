import React, { Component } from "react";
import { Card, Col, Divider, Row, Space, Spin } from "antd";
import AEPForm from "./form";
import SendFile from "./SendFile";
import { connect } from "react-redux";
import {
  generateAEP,
  getAEPGraduate,
  getARPStaff2,
} from "../../../../../store/actions/staff";
import { LoadingOutlined } from "@ant-design/icons";
import { blobToSaveAs } from "./blobToPdf";
import LiberationForm from "./liberationForm";

class AEPProcess extends Component {
  constructor(props) {
    super(props);
    this.props.getAEPGraduate(this.props.graduatePK);
    this.props.getARPStaff();
    console.log("=====", this.props.status);
    this.state = {
      generating: false,
      saving: false,
      values: null,
      hasToSave: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { generating, hasToSave } = this.state;
    if (hasToSave) {
      this.setGenerateAEP();
    } else {
      if (generating && this.props.generated) {
        this.downloadAEP();
      }
    }
  }

  downloadAEP = () => {
    let { preAEP } = this.props.aepDoc;
    let blob = new Blob([preAEP], { type: "application/pdf" });
    blobToSaveAs(`${this.props.graduatePK}_aep_preview.pdf`, blob);
    // const documentBuffer = await instance.exportPDF();
    this.setState({
      generating: false,
    });
  };

  setGenerateAEP = () => {
    this.props.generateAEP(this.state.values);
    this.setState({
      hasToSave: false,
    });
  };

  onActaGenerate = (values) => {
    this.setState({
      values: values,
      generating: true,
      hasToSave: true,
    });
  };

  render() {
    console.log("stado", this.props.status);
    const showForm = this.props.status !== "STATUS_15";
    return (
      <Space direction="vertical" style={{ width: "100%", height: "100%" }}>
        {this.props.loadingData ? (
          <div
            style={{ justifyContent: "center", display: "flex", marginTop: 10 }}
          >
            <Spin
              tip="Cargando datos del egresado..."
              indicator={<LoadingOutlined />}
            />
          </div>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                marginBottom: 10,
              }}
            >
              <Card.Meta description="Archivo" />
              <Row
                style={{
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <Col span={20}>
                  <SendFile
                    graduatePK={this.props.dataGraduate.enrollment}
                    metadata={this.props.dataGraduate["aepDocument"]}
                  />
                </Col>
                <Col span={3}>
                  <LiberationForm
                    graduatePK={this.props.graduatePK}
                    status={this.props.status}
                  />
                </Col>
              </Row>
            </div>
            <Divider style={{ marginLeft: 0, marginRight: 0 }} />
            {showForm ? (
              this.props.loadingStaff ? (
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: 20,
                  }}
                >
                  <Spin
                    tip="Cargando datos del staff..."
                    indicator={<LoadingOutlined />}
                  />
                </div>
              ) : (
                <AEPForm
                  onFinish={this.onActaGenerate}
                  dataSource={this.props.dataGraduate}
                  staffData={this.props.staffData}
                  loading={this.props.loadingData}
                  generating={this.state.generating}
                />
              )
            ) : null}
          </>
        )}
      </Space>
    );
  }
}

const mapStateToProps = (state) => {
  let data = state.dataStaff;
  let dataGraduate = [];
  let staffData = [];
  let loading = true;
  let loadingARPStaff = true;
  let generated = false;
  let aepDoc = null;
  // console.log("datos del egresado", data);
  if (data.payload !== null) {
    let aepGraduate = data.payload["aepGraduate"];
    if (aepGraduate !== undefined) {
      if (aepGraduate.status === "success" && aepGraduate.action === "get") {
        loading = false;
        dataGraduate = aepGraduate.data["aepGraduate"];
      }
    }
    let arpStaff = data.payload["arpStaff"];
    if (arpStaff !== undefined) {
      staffData = arpStaff.data;
      if (arpStaff.status === "success" && arpStaff.action === "get") {
        loadingARPStaff = false;
      }
    }
    let preAEP = data.payload["preAEP"];
    if (preAEP !== undefined) {
      aepDoc = preAEP.data;
      if (preAEP.status === "success" && preAEP.action === "get") {
        generated = true;
      }
    }
  }

  return {
    loadingData: loading,
    dataGraduate: dataGraduate,
    loadingStaff: loadingARPStaff,
    staffData: staffData,
    generated: generated,
    aepDoc: aepDoc,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAEPGraduate: (enrollment) => {
      dispatch(getAEPGraduate(enrollment));
    },
    getARPStaff: () => {
      dispatch(getARPStaff2());
    },
    generateAEP: (values) => {
      dispatch(generateAEP(values));
    },
    uploadAEP: (file) => {
      console.log(file);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AEPProcess);
