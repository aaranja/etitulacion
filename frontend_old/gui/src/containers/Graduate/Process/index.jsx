import React from "react";
import { Button, Divider, Layout, PageHeader } from "antd";
import { connect } from "react-redux";
import Sidebar from "../../../components/Sidebar";
import Information from "./Information";
import Dossier from "./Dossier";
import Approval from "./Approval";
import InaugurationDate from "./InaugurationDate";
import { default as currentStatus } from "../../../site/collections/statusTypes";
import * as actions from "../../../store/actions/account";
import "./index.css";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import Liberation from "./Liberation";

const { Content } = Layout;
const { Sider } = Layout;

/*Class to show graduate process ui*/
class Process extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      currentStep: 0,
      first_load: true,
      goNext: false,
      sidebarSize: 300,
      canNext: false,
    };
  }

  componentDidMount() {
    this.childContent = React.createRef();
    this.props.getGraduateData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.first_load && !this.props.loading) {
      /* update data in the first load */
      this.setState({
        first_load: false,
        currentStep: this.props.status.key,
        percent: this.props.status.view,
        step: this.props.status.key,
      });
    } else {
      /* if is not loading and is not the first load */
      /* and goNext is true, set the new view and the new currentStep */
      if (this.state.goNext && !this.props.loading) {
        this.setState({
          currentStep: this.props.status.key,
          percent: this.props.status.view,
          goNext: false,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /* only update when */

    // loading is updated
    if (nextProps.loading !== this.props.loading) {
      return true;
    }

    /* if is saving the new status */
    if (this.state.goNext) return true;

    // is the first load
    return !nextState.first_load;
  }

  getChildState = (step) => {
    this.setState({ step: step });
  };

  enableModify = () => {
    /* enable remove files of dossier step, unable remove files when status insn't 'STATUS_02'
     * Dossier files can be modified when status is: "STATUS_02", "STATUS_04" or "STATUS_07".
     *
     * */

    let status = this.props.status.code;
    console.log(status);
    console.log("puede modificar");
    return (
      status === "STATUS_02" ||
      status === "STATUS_05" ||
      status === "STATUS_08" ||
      status === "STATUS_01"
    );
  };

  enableNext = (can_next, new_status) => {
    /* function to enable next button when the process step is  complete */
    let currentStatus = this.props.status.code;
    if (!can_next) {
      if (currentStatus === "STATUS_02") {
        this.props.setNewStatus(new_status);
      }
    }

    this.setState({ canNext: can_next });
  };

  onNext = (next_view, new_status, can_go) => {
    let currentStatus = this.props.status.key;
    let canNext = false;
    if (can_go) {
      /*
       * send the new status to server side
       * if current procces step is complete
       * */
      if (currentStatus < next_view) {
        this.props.setNewStatus(new_status);
      }

      this.setState({ goNext: true, canNext: canNext, step: next_view });
    }
  };

  onBack = (step) => {
    /* set the current stepview back
     * enable go to next view default
     * */
    this.setState({
      step: step - 1,
      canNext: true,
    });
  };

  onCollapse = (collapsed) => {
    let size = 300;
    if (collapsed) size = 0;
    this.setState({
      sidebarSize: size,
    });
  };

  render() {
    /* First get the current view by the grdadute status
     * */
    let current;
    if (!this.state.first_load)
      switch (this.state.step) {
        case 0:
          current = {
            key: 0,
            title: "Información",
            view: (
              <Information
                ref={this.childContent}
                enableNext={this.enableNext}
              />
            ),
            hasOnBack: false,
            canNext: () => {
              this.onNext(1, "STATUS_01", this.childContent.current.goNext());
            },
          };
          break;
        case 1:
          current = {
            title: "Expediente",
            view: (
              <Dossier
                ref={this.childContent}
                callbackFromParent={this.getChildState}
                enableNext={this.enableNext}
                enableModify={this.enableModify()}
              />
            ),

            hasOnBack: true,
            canNext: () => {
              this.onNext(2, "STATUS_02", this.childContent.current.goNext());
            },
          };
          break;
        case 2:
          current = {
            title: "Validación",
            view: (
              <Approval
                ref={this.childContent}
                goDocuments={this.getChildState}
                enableNext={this.enableNext}
              />
            ),
            hasOnBack: true,
            canNext: () => {
              this.onNext(3, "STATUS_10", this.childContent.current.goNext());
            },
          };
          break;
        case 3:
          current = {
            title: "Toma de protesta",
            view: (
              <InaugurationDate
                enableNext={this.enableNext}
                ref={this.childContent}
                user={this.props.user}
              />
            ),
            hasOnBack: true,
            canNext: () => {
              this.onNext(4, "STATUS_14", this.childContent.current.goNext());
            },
          };
          break;
        case 4:
          current = {
            title: "Liberación del Certificado de Acta de Examen Profesional",
            view: <Liberation user={this.props.user} />,
            hasOnBack: true,
          };
          break;
        default:
          current = {
            title: "Liberación del Certificado de Acta de Examen Profesional",
            view: <Liberation user={this.props.user} />,
            hasOnBack: true,
          };
      }
    return this.state.first_load ? (
      <p>CARGANDO</p>
    ) : (
      <Layout
        className="wrapper"
        style={{
          display: "flex",
          justifyContent: "space-betweenn",
          marginTop: 30,
          backgroundColor: "white",
        }}
      >
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          collapsible
          zeroWidthTriggerStyle={{ opacity: "0.2" }}
          onCollapse={this.onCollapse}
          trigger={<Loading3QuartersOutlined />}
          width={300}
          style={{
            backgroundColor: "white",
            position: "fixed",
            zIndex: "40",
          }}
        >
          <Sidebar
            className="sidebar"
            currentFinished={this.state.percent}
            style={{ top: 0, height: "25vh" }}
          />
        </Sider>
        <Content
          style={{
            marginLeft: this.state.sidebarSize,
            minWidth: "320px",
          }}
        >
          <PageHeader
            title={current.title}
            backIcon={current.hasOnBack ? <ArrowLeftOutlined /> : null}
            onBack={() => {
              this.onBack(this.state.step);
            }}
            extra={[
              this.state.step < 4 ? (
                <Button
                  key="1"
                  type="primary"
                  onClick={current.canNext}
                  disabled={!this.state.canNext}
                >
                  Siguiente <ArrowRightOutlined />
                </Button>
              ) : null,
            ]}
            style={{
              marginBottom: 0,
            }}
          />
          <Divider style={{ marginTop: 0 }} />
          {current.view}
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  let status = { key: 0 };
  let email_confirmed = null;
  if (state.account.payload !== null) {
    status = currentStatus[state.account.payload.status];
    console.log(state.auth.payload);
    email_confirmed = state.auth.payload.email_confirmed;
  }
  return {
    loading: state.account.loading,
    error: state.account.error,
    user: state.account.payload,
    status: status,
    email_confirmed: email_confirmed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGraduateData() {
      dispatch(actions.accountGetData());
    },
    setNewStatus(status) {
      dispatch(actions.accountStatusUpdate(status));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Process);
