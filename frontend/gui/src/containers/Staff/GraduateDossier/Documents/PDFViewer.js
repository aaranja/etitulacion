import React, { Component } from "react";
import {
  PageHeader,
  Pagination,
  Slider,
  Affix,
  Space,
  Button,
  Divider,
} from "antd";
import { LoadingOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { Typography } from "antd/es";

class PDFViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.topDiv = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, context) {
    if (this.state.loading) {
      if (this.props.document !== null) {
        this.setState({
          loading: false,
          pageNumber: 1,
          numPages: null,
          zoom: 1.5,
          div: null,
        });
      }
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages: numPages,
    });
  };

  onChange = (page) => {
    this.setState({
      pageNumber: page,
    });
  };

  onZoom = (zoom) => {
    this.setState({
      zoom: zoom,
    });
  };

  render() {
    const pagination = () => {
      if (this.state.numPages !== null && !this.state.loading) {
        const pages = this.state.numPages;
        return (
          <Pagination
            simple
            size="small"
            defaultCurrent={1}
            total={pages * 10}
            onChange={this.onChange}
          />
        );
      }
    };

    return (
      <div style={{ backgroundColor: "#fafafa" }}>
        <PageHeader
          ghost={false}
          title={this.props.title}
          onBack={() => {
            this.props.callBack("table", null);
          }}
          style={{ zIndex: 1, backgroundColor: "white" }}
          /*subTitle="This is a subtitle"*/
          extra={[
            <Space
              style={{
                position: "fixed",
                right: "16%",
                backgroundColor: "white",
              }}
            >
              <Typography.Text>Página</Typography.Text> {pagination()}
              <Divider type="vertical" />
              <Button
                icon={<ZoomOutOutlined />}
                onClick={() => this.onZoom(this.state.zoom - 0.25)}
              />
              <Typography.Text>{this.state.zoom * 100}%</Typography.Text>
              <Button
                icon={<ZoomOutOutlined />}
                onClick={() => this.onZoom(this.state.zoom + 0.25)}
              />
            </Space>,
          ]}
        />

        {this.state.loading ? (
          <LoadingOutlined />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowX: "auto",
              zIndex: 0,
            }}
            ref={this.topDiv}
          >
            <div
              style={{
                marginTop: 20,
                marginBottom: 20,
                boxShadow: "1px 3px 3px 1px #9E9E9E",
                borderRadius: 5 + "px",
              }}
            >
              <Document
                file={this.props.document}
                onLoadSuccess={(value) => this.onDocumentLoadSuccess(value)}
                error="Error al cargar el documento"
              >
                <Page
                  scale={this.state.zoom}
                  pageNumber={this.state.pageNumber}
                />
              </Document>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PDFViewer;
