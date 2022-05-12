import React, { Component } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  message,
  Modal,
  Row,
  Space,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ImageCropped from "../ImageCropped";

const { Item } = Form;
export default class ImageFileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [{ uid: "-1", name: "hola.png" }],
      file: null,
      sourceFile: null,
      saving: false,
      loaded: false,
      crop: false,
      cropped: false,
    };
  }

  componentDidMount() {
    this.uploadButton = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (!nextProps.loading && !this.state.loaded) {
      nextState.file = URL.createObjectURL(nextProps.src);
      nextState.sourceFile = nextProps.src;
      nextState.loaded = true;
    }
    return true;
  }

  onCropComplete = (crop, zoom, aspect, croppedImageUrl) => {
    let fileList = this.state.fileList;

    let file = new File([croppedImageUrl], this.props.keyname + ".png", {
      type: "image/png",
    });
    fileList.originFileObj = file;
    fileList.lastModified = file.lastModified;
    fileList.lastModifiedDate = file.lastModifiedDate;
    fileList.percent = 0;
    fileList.status = "upload";
    fileList.type = "image/png";

    this.setState({
      file: URL.createObjectURL(croppedImageUrl),
      crop: false,
      fileList: fileList,
    });
    this.props.hasCropped(
      this.props.keyname,
      { file: file, fileList: fileList },
      "upload"
    );
  };

  render() {
    const showModal = () => {
      this.setState({ crop: true });
    };

    // const handleOk = () => {
    //   this.setState({ cropComplete: true, crop: false });
    // };

    const handleCancel = () => {
      this.setState({ cropComplete: false, crop: false });
    };

    const uploadProps = {
      maxCount: 1,
      multiple: false,
      onRemove: () => {
        this.setState({
          fileList: [],
          file: null,
        });
      },
      onChange: (info) => {
        if (info.fileList.length === 1) {
          if (
            info.file.type === "image/png" ||
            info.file.type === "image/jpeg"
          ) {
            let fileList = this.state.fileList;
            let newFileList = info.fileList;
            console.log(newFileList);
            let newFile = info.file;
            newFileList[0].status = "upload";
            // remove the old
            fileList.pop();
            // set the new
            const reader = new FileReader();
            reader.readAsDataURL(newFile);
            reader.onload = () => {
              // set the preview on component
              this.setState({
                file: reader.result,
                fileList: newFileList,
              });
            };
          }
        }
      },
      beforeUpload: (file) => {
        if (file.type !== "image/png" || file.type === "image/jpeg") {
          message.error(`${file.name} is not a png file`);
        } else {
        }
        return false;
      },
    };
    return (
      <>
        <Modal
          title="Recortar"
          visible={this.state.crop}
          onCancel={handleCancel}
          width={1000}
          footer={null}
        >
          <ImageCropped
            image={this.state.file}
            callBack={this.onCropComplete}
            onCancel={handleCancel}
          />
        </Modal>
        <Row>
          <Col>
            <Card
              style={{
                width: 510,
                height: 250,
                backgroundColor: "#FAFAFA",
                overflow: "hidden",
              }}
              cover={
                <Row justify="center">
                  <Col
                    style={{
                      maxWidth: 500,
                      maxHeight: 240,
                      alignContent: "center",
                    }}
                  >
                    {this.props.loading ? (
                      <p>Cargando</p>
                    ) : (
                      <Image src={this.state.file} />
                    )}
                  </Col>
                </Row>
              }
            >
              {" "}
            </Card>
          </Col>
          <Col style={{ paddingLeft: 20 }}>
            <Item
              key={1}
              name={this.props.keyname}
              label="Cargar nuevo archivo"
              hasFeedback
              value={{ file: this.state.file, fileList: this.state.fileList }}
            >
              <Upload
                {...uploadProps}
                fileList={this.state.fileList}
                ref={this.uploadButton}
              >
                <Button>
                  <UploadOutlined /> Subir
                </Button>
              </Upload>
            </Item>
            <Space>
              <Button onClick={showModal}>{"Editar imagen"}</Button>
            </Space>
          </Col>
        </Row>
      </>
    );
  }
}
