import React, { Component } from "react";
import { FileDoneOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { connect } from "react-redux";
import { setLiberation } from "../../../../../store/actions/staff";

class LiberationForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    console.log(this.props.status);
    const content = (status) => {
      switch (status) {
        case "STATUS_13":
        case "STATUS_14":
          return (
            <Button
              icon={<FileDoneOutlined />}
              type="primary"
              onClick={() => this.props.setLiberation(this.props.graduatePK)}
            >
              Liberar
            </Button>
          );
        case "STATUS_15":
          return (
            <Button
              icon={<CloseCircleOutlined />}
              type="danger"
              onClick={() => this.props.cancelLiberation(this.props.graduatePK)}
            >
              Cancelar liberación
            </Button>
          );
        default:
          return (
            <Button icon={<FileDoneOutlined />} type="primary" disabled={true}>
              No disponible
            </Button>
          );
      }
    };

    return content(this.props.status);
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLiberation: (enrollment) => {
      dispatch(setLiberation(enrollment, "success"));
    },
    cancelLiberation: (enrollment) => {
      dispatch(setLiberation(enrollment, "cancel"));
    },
  };
};

export default connect(null, mapDispatchToProps)(LiberationForm);
