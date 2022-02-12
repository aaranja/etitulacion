import React, { Component } from "react";
import { getDocumentsMetadata } from "../../../../store/actions/serverdata";
import { connect } from "react-redux";
import {
  Button,
  Descriptions,
  Divider,
  notification,
  Space,
  Spin,
  Tag,
  Layout,
  Typography,
} from "antd";
import DocumentsTable from "./DocumentsTable";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  accountUploadDocument,
  getDocumentFile,
} from "../../../../store/actions/account";
import PDFModal from "../../../../components/PDFModal";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Content } = Layout;

class Dossier extends Component {
  /*
   * Class to render the dossier graduate view.
   * Process step 2: Upload Documents
   * */

  constructor(props) {
    super(props);

    this.state = {
      hasChanges: false,
      saveChanges: false,
      current: null,
      uploadList: [],
      previewVisible: false,
      metaFileOnView: null,
      arrayFileOnView: null,
    };
  }

  componentDidMount() {
    /*reference to table documents*/
    this.documents_table = React.createRef();
    /* get documents metadata */
    this.props.getDocumentsMetadata();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /* When component is recharged, verify if upload list length is 0,
     * if is not 0, remove one and the upload it
     * then, update the state to do the same until the upload list length is 0 */

    let saveChanges = this.state.saveChanges; // save changes flag: true - save files, no files to save
    let uploadList = this.state.uploadList;

    /* prev true and current false, means the saving is set */
    let currentSaved = prevProps.account.loading && !this.props.account.loading;

    if (saveChanges) {
      /* if save button was clicked */
      if (this.state.current === null) {
        /* when current is already uploaded,
                                                                                                                                                                                 upload a document and remove it from the list */
        const document = uploadList.shift();
        this.props.uploadDocument(document);

        /* set the new current upload file */
        this.setState({
          current: {
            key: document.metadata.key,
            status: document.type === "uploading" ? "success" : "removed",
          },
        });
      } else {
        /* when the current is not set uploaded */
        if (currentSaved) {
          /* if the state of loading means the current is uploaded */
          const data = this.state.current;
          /* set the status in the table */
          this.documents_table.current.onUploadSuccess(data.key, data.status);
          /* */
          this.setState({
            current: null,
            uploadList: uploadList,
            saveChanges: uploadList.length > 0,
            hasChanges: uploadList.length > 0,
          });
        }
      }
    } else {
      /* Check if the whole documents required are upload to enable next step button
       * */
      if (
        prevState.hasChanges !== this.state.hasChanges &&
        !this.state.hasChanges
      ) {
        let isComplete = this.dossierComplete();
        let status = isComplete ? null : "STATUS_01";
        this.props.enableNext(isComplete, status);
      }
    }

    if (prevProps.document !== this.props.document) {
      this.setState({
        previewVisible: true,
        arrayFileOnView: this.props.document.data,
      });
    }
  }

  tableMounted = () => {
    /*
     * First load, verify if dossier is complete
     *
     * */
    let isComplete = this.props.dossierComplete;

    this.props.enableNext(isComplete);
  };

  onUploadDocuments = () => {
    /*
     * Function to send new files to uploadList state,
     * to send to server when component is updated
     * */

    // get documents from documents table
    let data = this.documents_table.current.onUpload();
    // get metadata and files
    const metadata = data[0];
    const files = data[1];
    // create a upload list
    let uploadList = [];

    // get uploading or removing documents only
    for (const key in metadata) {
      const metadataFile = metadata[key];
      //  save file into upload if
      if (
        metadataFile.status === "uploading" ||
        metadataFile.status === "removed"
      ) {
        let new_upload = {
          metadata: metadataFile,
          file: files[key],
          type: metadataFile.status,
        };
        uploadList.push(new_upload);
      }
    }

    // if list has one document to save,
    // save upload list in state and set saveChanges to true
    if (uploadList.length !== 0) {
      this.setState({
        uploadList: uploadList,
        loading: true,
        saveChanges: true,
      });
    }
  };

  newChanges = (changes, type) => {
    /*
     * Function to mark current tag changes
     * */
    if (changes) {
      this.setState({
        hasChanges: changes,
        typeChange: type,
      });
    }
  };

  openNotification = (message, type) => {
    /*
     * Open a notification about page state
     * */
    notification.open({
      message: type,
      description: message,
      icon: <CloseCircleOutlined style={{ color: "#FF4848" }} />,
    });
  };

  dossierComplete = () => {
    /* if hasn't all documents required upload, cannot */
    let dataSource = this.documents_table.current.state.dataSource;
    let fileList = this.documents_table.current.state.fileList;
    for (const key in dataSource) {
      if (fileList[key].status !== "success" && dataSource[key].required)
        return false;
    }
    // return true if dossier is complete
    return true;
  };

  goNext = () => {
    /* Function to set can go to the next process */
    /* if has changes to save or is saving, cannot */
    if (this.state.hasChanges || this.state.saveChanges) return false;
    else {
      return this.dossierComplete();
    }
  };

  onShowPreview = (visible, file, keyName) => {
    let reader = new FileReader();
    if (visible) {
      if (file.status === "processing") {
        reader.readAsArrayBuffer(file.originFileObj);
        reader.onload = () => {
          this.setState({
            previewVisible: visible,
            metaFileOnView: file,
            arrayFileOnView: reader.result,
          });
        };
        reader.onerror = () => {
          console.log(reader.error);
        };
      } else {
        this.setState({
          metaFileOnView: file,
        });
        this.props.getDocument(keyName);
      }
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
        <Descriptions
          size="middle"
          column={1}
          style={{ marginLeft: 60, marginRight: 120 }}
        >
          <Descriptions.Item label={<b>INSTRUCCIONES</b>}>
            <Typography.Paragraph>
              Deberá subir en cada uno de los apartos correspondientes los
              documentos{" "}
              <Typography.Text strong>ESCANEADOS EN ORIGINAL</Typography.Text>{" "}
              para su cotejo.{" "}
              <Typography.Text strong>
                Un archivo digital (PDF) por cada documento, por ambos lados, no
                mayor a 2.5MB.
              </Typography.Text>
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="center">Subir documentación</Divider>
        {this.props.loading !== true ? (
          <Content
            style={{
              margin: "auto",
            }}
          >
            <Space
              style={{
                marginBottom: 16,
                width: "100%",
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <Button
                style={{ marginRight: 25 }}
                onClick={() => {
                  this.onUploadDocuments();
                }}
                disabled={!this.state.hasChanges}
              >
                Guardar
              </Button>
              <Tag visible={this.state.hasChanges}>
                Tienes cambios sin guardar
              </Tag>
            </Space>

            <PDFModal
              onClose={() => this.onShowPreview(false, null)}
              file={this.state.arrayFileOnView}
              metadata={this.state.metaFileOnView}
              previewVisible={this.state.previewVisible}
            />

            <DocumentsTable
              dataSource={this.props.dataSource}
              ref={this.documents_table}
              callBack={this.newChanges}
              setTableMounted={this.tableMounted}
              canRemove={this.props.enableModify}
              onPreviewDocument={this.onShowPreview}
            />
          </Content>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10vh",
            }}
          >
            {" "}
            <Spin indicator={loadingIcon} />
          </div>
        )}
      </div>
    );
  }
}

const tableMetadata = (metadata, userDocument) => {
  /*
   * Function to return a merge bewtween document metadata and user document,
   * to set into dataSource
   * */
  let fileName = "";
  let status = "empty";
  let url = "";
  if (userDocument !== undefined) {
    fileName = userDocument.fileName;
    status = userDocument.status;
    url = userDocument.url;
  }

  return {
    key: metadata.key,
    keyName: metadata.keyName,
    fileName: fileName,
    fullName: metadata.fullName,
    description: metadata.description,
    status: status,
    required: metadata.required,
    url: url,
  };
};

const mapStateToProps = (state) => {
  let dataSource = [];
  let metadata = null;
  let loading = true;
  let complete = false;
  let document = null;

  if (!state.serverdata.loading && state.serverdata.payload !== null) {
    complete = true;
    /* when isn't loading and payload have data */
    metadata = state.serverdata.payload.documents;
    let user_documents = state.account.payload.documents; // get user documents
    if (user_documents.length > 0) {
      /* when user has document uploaded */
      for (const key in metadata) {
        let found = false;
        let index = metadata[key].key; // documents index
        for (const doc_key in user_documents) {
          /* iterate all documents uploaded */
          let document = user_documents[doc_key];
          if (document.keyNum === index) {
            /* set the current document with his metadata into datasource */
            dataSource.push(tableMetadata(metadata[key], document));
            found = true;
            break;
          }
        }
        /* if the document is not found, set the metadata document into datasource */
        if (!found) {
          if (complete) complete = !metadata[key].required;
          dataSource.push(metadata[key]);
        }
      }
    } else {
      /* the user has not any document */
      complete = false;
      dataSource = metadata;
    }

    loading = false;
  }

  if (state.account.payload.document !== undefined) {
    document = state.account.payload.document;
  }
  return {
    account: state.account,
    dataSource: dataSource,
    nada: null,
    dossierComplete: complete,
    loading: loading,
    document: document,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDocumentsMetadata: () => {
      dispatch(getDocumentsMetadata("graduate_process"));
    },
    uploadDocument: (document) => {
      dispatch(
        accountUploadDocument(document.metadata, document.file, document.type)
      );
    },
    getDocument: (keyName) => {
      dispatch(getDocumentFile(keyName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Dossier);
