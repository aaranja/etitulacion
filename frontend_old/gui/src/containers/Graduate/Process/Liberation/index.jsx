import React, { Component } from "react";
import { Badge, Button, Card, Descriptions, Space, Typography } from "antd";
import { DownloadOutlined, FilePdfOutlined } from "@ant-design/icons";
import PDFModal from "../../../../components/PDFModal";
import { connect } from "react-redux";
import { getDocumentFile } from "../../../../store/actions/account";

class Liberation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      metaFileOnView: null,
      arrayFileOnView: null,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.document !== this.props.document &&
      this.state.metaFileOnView !== null
    ) {
      this.setState({
        previewVisible: true,
        arrayFileOnView: this.props.document.data,
      });
    }
  }

  onShowPreview = (visible, file) => {
    if (visible) {
      console.log("cargar documento");
      //   get file from sever
      this.setState({
        metaFileOnView: file,
      });
      this.props.getDocument("AEP");
    } else {
      this.setState({
        previewVisible: visible,
        metaFileOnView: null,
        arrayFileOnView: null,
      });
    }
  };

  render() {
    let done = this.props.user.status === "STATUS_15";

    return (
      <div style={{ marginLeft: 30 }}>
        <Descriptions
          size="small"
          column={1}
          style={{ marginLeft: 25, marginRight: 120 }}
        >
          <Descriptions.Item label={<b>INSTRUCCIONES</b>}>
            Espere a que el departamento de servicios escolares cargue su acta
            de examen profesional.
          </Descriptions.Item>
        </Descriptions>
        <Card
          bodyStyle={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Space align="start" direction="vertical" style={{ width: 250 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Estado ">
                {done ? (
                  <Badge status="success" text="Trámite exitoso" />
                ) : (
                  <Badge status="default" text="Sin cargar" />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Documento" />
            </Descriptions>
            <Card
              style={{ width: 250 }}
              hoverable={true}
              bodyStyle={{
                height: 120,
                justifyContent: "center",
                display: "flex",
                // backgroundColor: "#EEEEEE",
              }}
              actions={[
                null,
                <Button
                  icon={<DownloadOutlined />}
                  style={{ paddingLeft: 10 }}
                  type="primary"
                >
                  Descargar
                </Button>,
              ]}
            >
              {done ? (
                <Space
                  align="center"
                  direction="vertical"
                  onClick={() =>
                    this.onShowPreview(true, {
                      name: "Acta de Examen Profesional",
                    })
                  }
                >
                  <FilePdfOutlined
                    style={{
                      fontSize: 50,
                      backgroundColor: "white",
                      borderRadius: "4px",
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  />
                  <p>acta_examen_profesional.pdf</p>
                </Space>
              ) : (
                <Space>
                  <Typography.Text italic type="secondary">
                    Sin archivo
                  </Typography.Text>
                </Space>
              )}
            </Card>
          </Space>
        </Card>
        <PDFModal
          onClose={() => this.onShowPreview(false, null)}
          file={this.state.arrayFileOnView}
          previewVisible={this.state.previewVisible}
          metadata={this.state.metaFileOnView}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let document = null;
  if (state.account.payload.document !== undefined) {
    document = state.account.payload.document;
  }

  return {
    document: document,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDocument: (keyName) => {
      dispatch(getDocumentFile(keyName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Liberation);
