import React, { Component } from "react";
import { Button, message, Space, Upload } from "antd";
import {
  CloseCircleOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import {
  deleteAEPFile,
  getDocument,
  uploadAEPFile,
} from "../../../../../store/actions/staff";
import PDFModal from "../../../../../components/PDFModal";

class SendFile extends Component {
  constructor(props) {
    super(props);

    let fileList = this.buildFileList(this.props.metadata);

    this.state = {
      dataSource: null,
      fileList: fileList,
      oldFileList: [...fileList],
      uploading: false,
      file: null,
      hasChanges: false,
      hasToSave: false,
      previewVisible: false,
      metaFileOnView: null,
      arrayFileOnView: null,
    };
  }

  buildFileList = (metadata) => {
    if (metadata !== null) {
      return [
        {
          key: metadata.key,
          uid: "-1",
          name: metadata.fileName,
          status: metadata.status,
          url: "",
        },
      ];
    } else {
      return [];
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { uploading, hasToSave } = this.state;

    if (hasToSave) {
      let { file, fileList } = this.state;
      if (fileList.length > 0) {
        // save document
        this.props.uploadAEPFile(file, fileList, this.props.graduatePK);
      } else {
        //  delete current document
        this.props.deleteAEPFile(this.props.graduatePK);
      }
      this.setState({
        hasToSave: false,
      });
    } else {
      if (uploading && this.props.uploaded) {
        this.onUploadDone();
      }
    }

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

  onUploadDone = () => {
    // console.log("uploaded: ", this.props.uploaded);
    let { fileList } = this.state;
    let newFileList = [];
    if (this.props.error !== null) {
      if (fileList.length > 0) {
        fileList[0].status = "error";
        newFileList = [...fileList];
      } else {
        newFileList = this.state.oldFileList;
      }
      message.success(`Ocurrió un error al eliminar el archivo`);
    } else {
      if (fileList.length > 0) {
        fileList[0].status = "success";
        newFileList = [...fileList];
        message.success(`Archivo cargado correctamente`);
      } else {
        message.success(`Archivo eliminado correctamente`);
      }
    }

    this.setState({
      fileList: newFileList,
      oldFileList: [...newFileList],
      hasChanges: false,
      uploading: false,
    });
  };

  cancelChanges = () => {
    this.setState({
      hasChanges: false,
      hasToSave: false,
      file: null,
      fileList: this.state.oldFileList,
    });
  };

  onUploadFile = () => {
    this.setState({
      hasToSave: true,
      uploading: true,
    });
  };

  onShowPreview = (visible, file) => {
    let reader = new FileReader();

    if (visible) {
      if (file.status === "done") {
        //   get file from sever
        this.setState({
          metaFileOnView: file,
        });
        this.props.getDocument(this.props.graduatePK, "AEP");
      } else {
        reader.readAsArrayBuffer(file.originFileObj);
        reader.onload = () => {
          this.setState({
            previewVisible: visible,
            metaFileOnView: file,
            arrayFileOnView: reader.result,
          });
        };
      }
    } else {
      this.setState({
        previewVisible: visible,
        metaFileOnView: null,
        arrayFileOnView: null,
      });
    }
  };

  isVoid = (a) => {
    return !(a.length > 0);
  };

  render() {
    const upload_props = {
      name: "file",
      multiple: false,
      maxCount: 1,
      beforeUpload: (file) => {
        if (file.type !== "application/pdf") {
          message.error(`${file.name} no es un archivo PDF!`);
        }
        return false;
      },
      onChange: (info) => {
        let hasChanges = true;
        // if it has nothing on oldFileList, and is removed, it doesn't has changes
        if (this.isVoid(this.state.oldFileList) && this.isVoid(info.fileList)) {
          hasChanges = false;
        }

        this.setState({
          fileList: [...info.fileList],
          file: info.file,
          hasChanges: hasChanges,
        });
      },
      onPreview: async (file) => {
        this.onShowPreview(true, file);
      },
    };
    return (
      <Space
        direction={"horizontal"}
        align="start"
        style={{
          marginLeft: 20,
          width: "100%",
        }}
      >
        <div style={{ width: 250 }}>
          <Upload
            {...upload_props}
            fileList={this.state.fileList}
            listType="picture"
          >
            {this.state.fileList.length > 0 ? null : (
              <Button icon={<UploadOutlined />} style={{}}>
                Subir pdf
              </Button>
            )}
          </Upload>
        </div>
        <Space
          direction={"horizontal"}
          style={{ float: "right", width: "100%" }}
          align="start"
        >
          <Button
            disabled={this.state.uploading}
            icon={<CloseCircleOutlined />}
            type="text"
            style={{ display: this.state.hasChanges ? "block" : "none" }}
            onClick={this.cancelChanges}
            danger
          >
            Cancelar
          </Button>
          <Button
            loading={this.state.uploading}
            icon={<SaveOutlined />}
            type="default"
            style={{ display: this.state.hasChanges ? "block" : "none" }}
            onClick={this.onUploadFile}
          >
            Guardar
          </Button>
        </Space>

        <PDFModal
          onClose={() => this.onShowPreview(false, null)}
          file={this.state.arrayFileOnView}
          previewVisible={this.state.previewVisible}
          metadata={this.state.metaFileOnView}
        />
      </Space>
    );
  }
}

const mapStateToProps = (state) => {
  let data = state.dataStaff;
  let uploaded = false;
  let aepMetadata = null;
  let error = null;
  let loading = false;
  let document = null;
  console.log("========");
  if (data.payload !== null) {
    let aepDocument = data.payload["aepDocument"];
    if (aepDocument !== undefined) {
      if (aepDocument.status === "success" && !data.loading) {
        // console.log("exitoso", aepDocument);
        uploaded = true;
        aepMetadata = aepDocument.data;
        error = null;
      } else {
        if (aepDocument.status === "failed" && !data.loading) {
          // console.log("error", aepDocument);

          uploaded = true;
          error = state.dataStaff.error;
          console.log(error);
        }
      }
    }
  }
  let currentState = state.staff;
  if (currentState.payload !== null) {
    if (currentState.payload.document !== undefined) {
      if (currentState.payload.document !== null) {
        document = currentState.payload.document;
      }
    }
  }

  return {
    loading: loading,
    aepMetadata: aepMetadata,
    status: null,
    uploaded: uploaded,
    error: error,
    document: document,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadAEPFile: (file, fileList, enrollment) => {
      dispatch(uploadAEPFile(file, fileList[0], enrollment));
    },
    deleteAEPFile: (enrollment) => {
      dispatch(deleteAEPFile(enrollment));
    },
    getDocument: (enrollment, keyName) => {
      dispatch(getDocument(enrollment, keyName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendFile);
