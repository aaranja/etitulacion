import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/staff";
import * as userTypes from "../../../site/collections/userTypes";
import Documents from "./Documents";
import { LoadingOutlined } from "@ant-design/icons";
import CNIView from "./CNIView";
import ValidationView from "./ValidationView";
import ProcedureView from "./ProcedureView";

class GraduateDossier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "documents",
      title: null,
      sidebarSize: 350,
    };

    let request;

    if (this.props.user === "USER_SERVICES") request = "services_documents";
    else request = "coordination_documents";

    // get the name of the documents
    this.props.getDocumentsDetails(request);
    //get info and documents uploaded with enrollment
    window.history.pushState(
      "dossier/",
      "Expendiente del egresado",
      `/home/dossier/${props.graduatePK}/`
    );

    this.props.getGraduateData(props.graduatePK);
  }

  setCurrentView = (view) => {
    if (view !== this.state.currentView) {
      this.setState({
        currentView: view,
      });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.setSiderProps({
      graduate: this.props.graduateData,
      loading: this.props.loading,
      user: this.props.user,
      setCurrentView: this.setCurrentView,
    });
  }

  componentWillUnmount() {
    // remove graduate data when go out to graduate table
    if (this.props.graduatePK !== null) {
      this.props.reset("graduate");
    }
  }

  render() {
    const view = () => {
      switch (this.state.currentView) {
        case "documents":
          return (
            <Documents
              metadata={this.props.metadata}
              graduatePK={this.props.graduatePK}
            />
          );
        case "cni":
          return this.props.user === "USER_COORDINAT" ? (
            <ValidationView
              status={this.props.graduateData.status}
              graduatePK={this.props.graduatePK}
            />
          ) : (
            <CNIView
              status={this.props.graduateData.status}
              graduatePK={this.props.graduatePK}
            />
          );
        case "aep":
          return <p>Acta de examen profesional</p>;
        case "procedure":
          return (
            <ProcedureView
              user={this.props.user}
              history={this.props.graduateData.history}
              status={this.props.graduateData.status}
              graduatePK={this.props.graduatePK}
            />
          );
        default:
          return null;
      }
    };

    return this.props.loading ? <LoadingOutlined /> : view();
  }
}

/* function to get the required documents by user services or coordination*/
/* metadata: documents metadata from server */
/* graduate: documents uploaded by graduate user */
/* classification: number of classification document not required */
const formatDataSource = (metadata, graduate_doc, clasification) => {
  let list = [];
  let index = 1;
  const dict = {};

  // get graduate documents
  for (const index in graduate_doc) {
    dict[graduate_doc[index].keyName] = graduate_doc[index];
  }

  /* get documents metadata filtered by clasification */
  for (const key in metadata) {
    if (metadata[key]["clasification"] !== clasification) {
      /* push in the list if clasification is required*/
      list.push({
        key: index++,
        fullName: metadata[key].fullName,
        download: metadata[key].keyName,
      });
    }
  }
  return list;
};

const mapStateToProps = (state) => {
  let documents = [];
  let graduateData = null;
  let error = null;
  let loading = true;
  let loadingDocs = true;
  let currentState = state.staff;
  let viewDocument = null;
  let classification_remove =
    state.auth.payload.usertype === userTypes.USER_SERVICES ? 2 : 1;

  if (currentState.payload !== null) {
    // get documents name
    if (currentState.payload.document !== undefined) {
      if (currentState.payload.document !== null) {
        viewDocument = currentState.payload.document;
      }
    }

    // get graduate data
    if (
      currentState.payload.graduate !== undefined &&
      currentState.payload.graduate !== null
    ) {
      graduateData = currentState.payload.graduate;
      // console.log(graduateData);
      loading = false;
      if (
        graduateData.status === "STATUS_01" ||
        graduateData.status === "STATUS_00"
      ) {
        error = "NO_DOCUMENTS";
      } else {
        if (currentState.payload.documents !== undefined) {
          loadingDocs = false;
          documents = formatDataSource(
            currentState.payload.documents,
            graduateData.documents,
            classification_remove
          );
        }
      }
    }
  }

  return {
    loadingDocs: loadingDocs,
    loading: loading,
    metadata: documents,
    graduateData: graduateData,
    error: error,
    viewDocument: viewDocument,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGraduateData: (enrollment) => dispatch(actions.getGraduate(enrollment)),
    reset: (type) => dispatch(actions.resetData(type)),
    getDocumentsDetails: (request) =>
      dispatch(actions.getDocumentsDetails(request)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraduateDossier);
