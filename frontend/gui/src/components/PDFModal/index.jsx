import React, { Component } from "react";
import { Card, Col, Modal, Pagination, Row, Slider, Space } from "antd";
import { Document, Page } from "react-pdf/dist/umd/entry.webpack";

class PDFModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 1,
      numPages: null,
      zoom: 1.5,
    };
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    console.log(numPages);
    this.setState({
      numPages: numPages,
    });
  };

  onPaginationChange = (page) => {
    this.setState({
      pageNumber: page,
    });
  };
  onZoom = (zoom) => {
    this.setState({
      zoom: 1 + zoom / 2,
    });
  };

  render() {
    return (
      <Modal
        centered
        title={
          this.props.metadata !== null ? this.props.metadata.name : "Cargando"
        }
        visible={this.props.previewVisible}
        onOk={this.props.onClose}
        onCancel={this.props.onClose}
        width={1000}
        style={{ maxHeight: "80vh", backgroundColor: "red" }}
        bodyStyle={{ margin: 0, padding: 0 }}
        footer={
          <div
            style={{
              width: "100%",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Space direction="vertical" style={{ justifyContent: "center" }}>
              <Pagination
                simple
                style={{ alignSelf: "center" }}
                defaultCurrent={this.state.pageNumber}
                total={this.state.numPages * 10}
                onChange={this.onPaginationChange}
              />
              <Slider
                min={1}
                max={5}
                onChange={this.onZoom}
                style={{
                  width: "100%",
                }}
              />
            </Space>
          </div>
        }
      >
        {this.props.metadata !== null ? (
          <div style={{ overflow: "auto", maxHeight: "65vh" }}>
            <Card
              bordered={false}
              style={{ backgroundColor: "#EEEEEE" }}
              cover={
                <Row
                  justify="center"
                  style={{ paddingTop: 20, overflow: "auto" }}
                >
                  <Col>
                    <Document
                      file={this.props.file}
                      onLoadSuccess={(value) =>
                        this.onDocumentLoadSuccess(value)
                      }
                      style={{ alignSelf: "center" }}
                    >
                      <Page
                        scale={this.state.zoom}
                        pageNumber={this.state.pageNumber}
                      />
                    </Document>
                  </Col>
                </Row>
              }
            />
          </div>
        ) : (
          <p>Sin archivo</p>
        )}
      </Modal>
    );
  }
}

export default PDFModal;
