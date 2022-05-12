import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Descriptions, Divider, Timeline, Layout } from "antd";
import { Fail, InProcess, Success, Wait } from "./ApprovalStatus";
import { default as status } from "../../../../site/collections/statusTypes";
import * as actions from "../../../../store/actions/account";
import moment from "moment";
import Expand from "react-expand-animated";

const { Sider } = Layout;

class Approval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history_visible: false,
    };
  }

  componentDidMount() {
    let currentStatus = status[this.props.status];
    if (currentStatus.code !== "STATUS_02") {
      this.props.enableNext(
        currentStatus.next || currentStatus.key >= status["STATUS_10"].key
      );
      this.setState({
        history_visible: true,
      });
    }

    // get procedure history
    this.props.getProcedureHistory();
    // get notifications
    this.props.getNotifications();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.status !== this.props.status) {
      if (this.props.status !== "STATUS_02") {
        if (!this.state.history_visible) {
          this.setState({
            history_visible: true,
          });
        }
      } else {
        this.setState({
          history_visible: false,
        });
      }
    }
  }

  goNext = () => {
    /* only can go next if current status is superior to the next step view status */
    let currentStatus = status[this.props.status];
    return currentStatus.next || currentStatus.key >= status["STATUS_10"].key;
  };

  nextProcedureStep = (type, message) => {
    this.props.nextProcedure(type, message);
  };

  render() {
    let currentStatus = status[this.props.status];
    let approvalView = (status) => {
      switch (status.info) {
        case "APPROVAL_WAIT":
          return (
            <Wait
              type={status.info}
              history={this.props.history}
              onPressButton={this.nextProcedureStep}
            />
          );
        case "APPROVAL_WAIT_PROCESSING":
          return (
            <InProcess
              type={status.info}
              canCancel={true}
              cancelAction={this.nextProcedureStep}
            />
          );
        case "SERVICES_APPROVAL_PROCESSING":
        case "SERVICES_APPROVAL_SUCCESS":
        case "COORDINATION_APPROVAL_PROCESSING":
          return <InProcess type={status.info} canCancel={false} />;
        case "SERVICES_APPROVAL_ERROR":
        case "COORDINATION_APPROVAL_ERROR":
          return (
            <Fail
              type={status.info}
              goDocuments={this.props.goDocuments}
              resend={this.nextProcedureStep}
              notifications={this.props.notifications}
            />
          );
        default:
          return <Success type={status.info} />;
      }
    };

    let history = this.props.history !== undefined ? this.props.history : [];

    return (
      <div>
        <Descriptions
          size="middle"
          column={1}
          style={{ marginLeft: 40 }}
          layout="vertical"
        >
          <Descriptions.Item label={<b>Instrucciones</b>}>
            El trámite consta de dos secciones de evaluación de expediente
            realizados por el Departamento de Servicios Escolares y la
            Coordinación de Titulación.
          </Descriptions.Item>
        </Descriptions>

        <div
          style={{
            marginLeft: "20px",
            display: "flex",
            alignItem: "center",
          }}
          className={"historyValidation"}
        >
          <Expand open={this.state.history_visible} className={"historyBox"}>
            <Card
              style={{
                margin: 0,
                backgroundColor: "#fafafa",
              }}
              bordered={false}
            >
              <Divider
                orientation="center"
                type="horizontal"
                style={{ paddingBottom: 25, paddingLeft: 25, paddingRight: 25 }}
              >
                Historial
              </Divider>
              <Timeline
                reverse={true}
                mode="left"
                style={{
                  alignSelf: "center",
                  scrollBehavior: "smooth",
                  alignItems: "center",
                }}
              >
                {history !== [] ? (
                  history.map((register) => {
                    return (
                      <Timeline.Item
                        key={register.id}
                        style={{ fontSize: 14 }}
                        label={moment(register.time).format(
                          "DD [de] MMMM [de] YYYY | HH:mm"
                        )}
                      >
                        {register.information}
                      </Timeline.Item>
                    );
                  })
                ) : (
                  <p>CARGANDO</p>
                )}
              </Timeline>
            </Card>
          </Expand>

          <Card bordered={false} style={{ width: "100%" }}>
            {approvalView(currentStatus)}
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.account,
    status: state.account.payload.status,
    history: state.account.payload.procedure_history,
    notifications: state.account.payload.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProcedureHistory: () => {
      dispatch(actions.accountProcedureHistory("get", null));
    },
    nextProcedure: (type, message) => {
      dispatch(actions.accountProcedureStep(type, message));
    },
    getNotifications() {
      dispatch(actions.accountGetNotifications());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Approval);
