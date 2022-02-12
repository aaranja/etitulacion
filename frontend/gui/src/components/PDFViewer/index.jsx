import React, { Component } from "react";
import { Card, Pagination, Slider, Space, Col, Row } from "antd";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

const { Meta } = Card;

class PDFViewer extends Component {
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
      <Card
        title={this.props.filename}
        cover={
          <Row justify="center" style={{ paddingTop: 20, overflow: "auto" }}>
            <Col>
              <Document
                file={this.props.file}
                onLoadSuccess={(value) => this.onDocumentLoadSuccess(value)}
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
        actions={[
          <Space direction="vertical">
            <Pagination
              defaultCurrent={1}
              total={this.state.numPages * 10}
              onChange={this.onPaginationChange}
            />
            <Slider
              min={1}
              max={5}
              onChange={this.onZoom}
              style={{
                width: "90%",
              }}
            />
          </Space>,
        ]}
      >
        <Meta description="upload date: xx-xx-xx" />
      </Card>
    );
  }
}

export default PDFViewer;
