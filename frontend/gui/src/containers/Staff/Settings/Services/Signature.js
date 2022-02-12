import React, { Component } from "react";
import {
  Descriptions,
  PageHeader,
  Layout,
  Divider,
  Form,
  Button,
  Tag,
  message,
  Modal,
} from "antd";
import { connect } from "react-redux";
import { SaveOutlined } from "@ant-design/icons";

import ImageFileUpload from "../../../../components/ImageFileUpload";
import * as actions from "../../../../store/actions/staff";
import {
  getSignatureSettings,
  getSignaturePreview,
} from "../../../../store/actions/serverdata";
import PDFViewer from "../../../../components/PDFViewer";
const { Content } = Layout;

class Signature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasChanges: false,
      uploadList: [],
      saving: false,
      firstLoad: true,
      current: null,
      croppedList: {},
      previewVisible: false,
      metaFileOnView: null,
      arrayFileOnView: null,
    };
  }

  componentDidMount() {
    this.props.getFiles();
  }

  setHasChange = (changes) => {
    this.setState({ hasChanges: changes });
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return true;
  }

  componentWillUnmount() {
    this.props.reset();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (!this.props.loading && prevProps.loading) {
    // }
    let uploadList = this.state.uploadList;
    let currentSaved = prevProps.loading && !this.props.loading;

    if (this.state.saving) {
      /* if state is saving and is not any file in current save */
      if (this.state.current === null) {
        /* get a file and save it */
        const file = uploadList.shift();
        this.props.uploadFile(file);

        this.setState({
          current: {
            index: file.index,
            name: file.file.fileList[0].name,
            action_type: file.action_type,
          },
        });
      } else {
        /* when the current is not set uploaded*/

        if (currentSaved) {
          message.success({
            content: `Guardado: ${this.state.current.name}`,
            style: { marginTop: "65px" },
          });

          this.setState({
            current: null,
            uploadList: uploadList,
            saving: uploadList.length > 0,
            hasChanges: uploadList.length > 0,
          });
        }
      }
    } else {
      if (
        prevState.hasChanges !== this.state.hasChanges &&
        !this.state.hasChanges
      ) {
        if (this.props.error !== null) this.notification(false);
      }
    }
    if (prevProps.previewCNI !== this.props.previewCNI) {
      console.log(this.props.previewCNI);
      this.setState({
        previewVisible: true,
        arrayFileOnView: this.props.previewCNI.data,
      });
    }
  }

  onSaveCropped = (type, file, action_type) => {
    let croppedList = {};
    let croppedFiles = {};
    let cropped_file = {
      type: type,
      file: file,
      action_type: action_type,
    };
    croppedList[type] = true;
    croppedFiles[type] = cropped_file;

    this.setState({
      hasChanges: true,
      croppedFiles: croppedFiles,
      croppedList: croppedList,
    });
  };

  onSave = (values) => {
    let uploadList = this.state.uploadList;
    let croppedList = this.state.croppedList;
    for (const index in values) {
      if (croppedList[index] !== undefined) {
        /* set into uploadList the cropped image if exist */
        let croppedFile = this.state.croppedFiles[index];
        uploadList.push(croppedFile);
      } else {
        let upload = values[index];
        /* set into uploadList the uploaded image if exist */
        if (upload !== undefined) {
          let file = {
            type: index,
            file: upload,
            action_type: upload.fileList[0].status,
          };
          uploadList.push(file);
        }
      }
    }
    this.setState({
      saving: true,
      uploadList: uploadList,
    });
  };

  notification = (type) => {
    if (type) {
      message.success("Guardado.");
    } else {
      message.error("Ha ocurrido un error al subir un archivo.");
    }
  };

  onShowPreview = (visible) => {
    if (visible) {
      this.props.getCNIPreview();
    } else {
      this.setState({
        previewVisible: visible,
        metaFileOnView: null,
        arrayFileOnView: null,
      });
    }
  };

  render() {
    return (
      <div>
        <PageHeader
          title="Firma electrónica"
          subTitle="Configuración"
          extra={[
            <Button
              key="1"
              onClick={() => {
                this.onShowPreview(true);
              }}
              hidden={this.state.hasChanges}
            >
              Ver vista previa de CNI
            </Button>,
            <Tag visible={this.state.hasChanges} key="2">
              Tienes cambios sin guardar
            </Tag>,
            <Button
              type="primary"
              loading={this.state.saving}
              key="3"
              disabled={!this.state.hasChanges}
              htmlType="submit"
              form="signature"
              icon={<SaveOutlined />}
            >
              Guardar
            </Button>,
          ]}
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label={<b>Información</b>}>
              Sección de configuración de firma y sello para la Constancia de No
              Inconveniencia (CNI).{" "}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Modal
          centered
          visible={this.state.previewVisible}
          onOk={() => this.onShowPreview(false, null)}
          onCancel={() => this.onShowPreview(false, null)}
          width={1000}
          footer={null}
          style={{ maxHeight: "80vh" }}
        >
          {this.state.arrayFileOnView !== null ? (
            <div style={{ overflow: "auto", maxHeight: "70vh" }}>
              <PDFViewer
                filename="CNI vista previa"
                file={this.state.arrayFileOnView}
              />
            </div>
          ) : (
            <p>Sin archivo</p>
          )}
        </Modal>
        <Content
          style={{ marginLeft: 25, marginRight: 120, paddingBottom: 20 }}
        >
          <Form
            layout="vertical"
            name="signature"
            onFinish={(values) => {
              this.onSave(values);
            }}
            onChange={() => {
              this.setHasChange(true);
            }}
          >
            <Divider orientation="left">Firma</Divider>
            <ImageFileUpload
              keyname="signature"
              src={this.props.images.signature.image}
              loading={this.props.images.signature.loading}
              hasCropped={this.onSaveCropped}
            />
            <Divider orientation="left">Sello</Divider>
            <ImageFileUpload
              keyname="seal"
              src={this.props.images.seal.image}
              loading={this.props.images.seal.loading}
              hasCropped={this.onSaveCropped}
            />
          </Form>
        </Content>
      </div>
    );
  }
}

const mergeProps = (ownProps, ownMap, dispatchProps) => {
  return {
    ...ownProps,
    ...ownMap,
    ...dispatchProps,
  };
};

const mapStateToProps = (state) => {
  let seal = { image: null, loading: true };
  let signature = { image: null, loading: true };
  let payload = state.serverdata.payload;
  let previewCNI = null;

  if (payload !== null) {
    seal =
      payload.seal !== undefined
        ? { image: payload.seal, loading: false }
        : { image: null, loading: true };
    signature =
      payload.signature !== undefined
        ? { image: payload.signature, loading: false }
        : { image: null, loading: true };

    if (payload.previewCNI !== undefined) {
      previewCNI = payload.previewCNI;
    }
  }

  let loading = state.staff.loading;
  return {
    images: { seal: seal, signature: signature },
    previewCNI: previewCNI,
    loading: loading,
    error: state.staff.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFiles: () => dispatch(getSignatureSettings()),
    getCNIPreview: () => {
      dispatch(getSignaturePreview());
    },
    uploadFile: (file) => {
      dispatch(actions.uploadSignatureFiles(file));
    },
    reset: () => {
      dispatch(actions.resetData("all"));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Signature);
