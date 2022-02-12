import React, { Component } from "react";
import { PageHeader, Pagination, Slider, Affix, Space } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

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
          zoom: 1,
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
      if (this.state.numPages !== null) {
        const pages = this.state.numPages;
        return (
          <Pagination
            simple
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
          /*subTitle="This is a subtitle"*/
        />

        {this.state.loading ? (
          <LoadingOutlined />
        ) : (
          <div ref={this.topDiv}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
            <Affix
              offsetBottom={50}
              target={() => {
                if (this.topDiv !== null && this.topDiv !== undefined) {
                  return this.topDiv.current;
                }
              }}
              style={{
                position: "absolute",
                margin: "auto",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "grey",
                }}
              >
                <Space direction="vertical">
                  {pagination()}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Slider
                      min={1}
                      max={10}
                      onChange={this.onZoom}
                      style={{
                        width: "90%",
                      }}
                    />
                  </div>
                </Space>
              </div>
            </Affix>
          </div>
        )}
      </div>
    );
  }
}

export default PDFViewer;
