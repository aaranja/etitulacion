import React, { Component } from "react";
import { Layout } from "antd";
import GraduateTable from "./GraduateTable";
import InaugurationDate from "./InaugurationDate";
import * as styles from "../../site/collections/staffStyles";
import { staffHome } from "../../site/collections/staffHistory";
import "antd/dist/antd.css";
import ARPProtocol from "./ARPProtocol";
import LayoutStaff from "./LayoutStaff";
import IDSidebar from "./InaugurationDate/IDSidebar";
import CoordinationMenu from "./CoordinationMenu";
import ListSiderbar from "./GraduateTable/ListSiderbar";
import ARPSidebar from "./ARPProtocol/sidebar";
import ServicesMenu from "./ServicesMenu";
import AEProfessional from "./AEProfessional";
import AEPGeneration from "./AEProfessional/AEPGeneration";
import GraduateDossier from "./GraduateDossier";
import Information from "./GraduateDossier/Information";

export default class Staff extends Component {
  constructor(props) {
    super(props);
    /* change view if from url is set a graduate enrollment*/
    let pathname = this.props.pathname;
    if (this.props.match.match !== null) {
      // console.log(this.props.match);
      /* if is set*/
      this.state = {
        currentView: pathname,
        initialData: props.match.match.params.id, //graduate enrollment
      };
    } else {
      if (pathname === "home") {
        /* get custom history from user*/
        let history = staffHome(this.props.user);
        window.history.pushState(history.data, history.title, history.url);
        this.state = {
          currentView: "list",
        };
      } else {
        this.state = {
          currentView: pathname,
          initialData: null,
        };
      }
    }
  }

  setCurrentView = (view, initialData) => {
    if (view === "list") {
      /* get custom history from user*/
      let history = staffHome(this.props.user);
      window.history.pushState(history.data, history.title, history.url);
    }
    /* change the view */
    this.setState({
      currentView: view,
      initialData: initialData,
    });
  };

  onNavigate = (view) => {
    this.setState({
      currentView: view,
      initialData: null,
    });
  };

  render() {
    const staffMenu = () => {
      if (this.props.user === "USER_COORDINAT")
        return (
          <CoordinationMenu
            menuAction={(value) => {
              this.setCurrentView(value, null);
            }}
            selected={this.state.currentView}
          />
        );
      else
        return (
          <ServicesMenu
            selected={this.state.currentView}
            menuAction={(value) => {
              this.setCurrentView(value, null);
            }}
          />
        );
    };

    /* define the current view */
    const currentView = () => {
      // console.log("currentview: ", this.state.currentView);
      switch (this.state.currentView) {
        case "list":
          return {
            currentView: (
              <GraduateTable
                user={this.props.user}
                callBack={this.setCurrentView}
              />
            ),
            siderElement: <ListSiderbar />,
            headerName: "Lista de egresados",
          };

        case "dossier":
          return {
            currentView: (
              <GraduateDossier
                user={this.props.user}
                callBack={this.setCurrentView}
                graduatePK={this.state.initialData}
              />
            ),
            siderElement: (
              <Information
                user={this.props.user}
                loading={true}
                graduate={null}
              />
            ),
            headerName: null,
          };
        case "inauguration":
          return {
            currentView: <InaugurationDate callBack={this.setCurrentView} />,
            siderElement: <IDSidebar />,
          };
        case "arp":
          return {
            currentView: (
              <ARPProtocol
                user={this.props.user}
                initialData={this.state.initialData}
              />
            ),
            siderElement: <ARPSidebar />,
          };
        case "aeprofesional":
          return {
            currentView: (
              <AEProfessional
                user={this.props.user}
                initialData={this.state.initialData}
                callBack={this.setCurrentView}
              />
            ),
            siderElement: <ARPSidebar />,
            headerName: "Acta de examen profesional",
          };
        case "aepliberation":
          return {
            currentView: (
              <AEPGeneration
                user={this.props.user}
                initialData={this.state.initialData}
                callBack={this.setCurrentView}
              />
            ),
            siderElement: null,
          };
        default:
          return {
            currentView: null,
            siderElement: null,
          };
      }
    };

    let view = currentView();

    return (
      <Layout style={styles.layout}>
        <LayoutStaff
          id={this.state.currentView}
          siderelement={view.siderElement}
          menu={staffMenu()}
          // headerName={view.headerName}
        >
          {view.currentView}
        </LayoutStaff>
      </Layout>
    );
  }
}
