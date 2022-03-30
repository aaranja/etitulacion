import React, { Component } from "react";
import { Button, Card, Typography } from "antd";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/staff";
import "./documents.css";
import { DownloadOutlined } from "@ant-design/icons";
import PDFViewer from "./PDFViewer";

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "table",
      title: null,
      sidebarSize: 350,
    };
  }

  setCurrentView = (view, title) => {
    if (view === "table") {
      this.props.reset("document");
    }

    this.setState({
      currentView: view,
      title: title,
    });
  };

  onShowDocument = (code, fullName) => {
    this.props.getDocument(this.props.graduatePK, code);

    this.setCurrentView("documentPDF", fullName);
  };

  render() {
    const gridStyle = {
      borderRadius: "4px",
      width: 150,
      height: 150,
      textAlign: "center",
      margin: 10,
    };

    const documents = this.props.metadata.map((record) => {
      // console.log(record)
      return (
        <Card.Grid
          style={gridStyle}
          onClick={() => {
            this.onShowDocument(record.download, record.fullName);
          }}
          key={record.key}
          className="card-grid"
        >
          <Card.Meta
            description={
              <Typography.Paragraph>{record.fullName}</Typography.Paragraph>
            }
          />
        </Card.Grid>
      );
    });

    return this.state.currentView === "table" ? (
      <div style={{ marginLeft: 25, margin: 5, borderRadius: "4px" }}>
        {this.props.metadata.length <= 0 ? (
          <Card style={{ textAlign: "center" }}>
            No se ha subido ningún documento aún
          </Card>
        ) : (
          <Card
            title={<Typography.Title level={5}>Documentos</Typography.Title>}
            bordered={false}
            bodyStyle={{ marginLeft: 15 }}
            extra={[
              <Button key="download" type={"text"} icon={<DownloadOutlined />}>
                Descargar todo
              </Button>,
            ]}
          >
            {documents}
          </Card>
        )}
      </div>
    ) : (
      <PDFViewer
        callBack={this.setCurrentView}
        title={this.state.title}
        document={this.props.viewDocument}
      />
    );
  }
}

const mapStateToProps = (state) => {
  let viewDocument = null;
  let graduateDocuments = [];
  let currentState = state.staff;
  if (currentState.payload !== null) {
    if (currentState.payload.document !== undefined) {
      if (currentState.payload.document !== null) {
        viewDocument = currentState.payload.document;
      }
    }
  }

  return {
    viewDocument: viewDocument,
    graduateDocuments: graduateDocuments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reset: (type) => dispatch(actions.resetData(type)),
    getDocument: (enrollment, keyName) => {
      dispatch(actions.getDocument(enrollment, keyName));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Documents);
