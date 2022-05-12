import React, { Component } from "react";
import { Button, Drawer, message, Space, Tooltip } from "antd";
import EditableTable from "./editableTable";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  createARPStaff,
  deleteARPStaff,
  getARPStaff,
  updateARPStaff,
} from "../../../../store/actions/staff";

class ARPStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasToSave: false,
      hasToSaved: false,
      actionType: null,
      saving: false,
      savingData: null,
      arpActions: {},
      activeOption: "",
      deleting: false,
    };
  }

  componentDidMount() {
    this.props.getARPStaff();
    this.arpTable = React.createRef();
  }

  onSetAction = (value) => {
    console.log(value);
    this.setState({
      arpActions: value,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.hasToSaved) {
      const { actionType, savingData } = this.state;
      // send to server
      this.props.actionARPStaff(actionType, savingData);
      // set edit to false
      // this.state.arpActions.save(savingData);
      // set to save false
      this.setState({
        hasToSaved: false,
      });
    } else {
      if (this.props.loading !== prevProps.loading && !this.props.loading) {
        if (this.props.error === null) {
          if (this.state.saving) {
            message.success("Datos guardados");
            // set changes saved
            this.arpTable.current.onSave(this.state.savingData);
            this.setState({ saving: false, activeOption: "", deleting: false });
          }
        } else {
          console.log("ha ocurrido un error");
          console.log("error", this.props.error);
          this.setState({
            saving: false,
            activeOption: "",
            deleting: false,
          });
        }
      }
    }
  }

  onDelete = () => {
    this.setState({
      deleting: true,
    });
    this.arpTable.current.formRef.current.submit();
  };

  onSaveChanges = (values, type) => {
    let actionType = type;
    if (this.state.deleting) {
      actionType = "delete";
    }

    // this.arpSave.save(values);
    this.setState({
      hasToSave: false,
      hasToSaved: true,
      saving: true,
      actionType: actionType,
      savingData: values,
    });
  };

  onChange = (value) => {
    this.setState({
      hasToSave: value,
      activeOption: "edit",
    });
  };

  onAddStaff = () => {
    this.setState({
      hasToSave: true,
      activeOption: "",
    });

    this.state.arpActions.add();
  };

  render() {
    let data = this.props.arpStaff;
    return (
      <Drawer
        title="Personal ARP"
        width="100%"
        getContainer={false}
        style={{ position: "absolute", height: "100%" }}
        closable={true}
        onClose={() => {
          this.props.show(false);
        }}
        visible={this.props.visible}
      >
        <Space
          style={{
            justifyContent: "space-between",
            display: "flex",
            margin: 10,
          }}
          direction="horizontal"
        >
          <Space
            direction="horizontal"
            style={{ float: "left", marginRight: "auto" }}
          >
            <Tooltip title="Añadir personal">
              <Button
                icon={<UserAddOutlined />}
                onClick={this.onAddStaff}
                disabled={this.state.hasToSave}
              />
            </Tooltip>
            {this.state.hasToSave && this.state.activeOption === "edit" ? (
              <Button
                type="danger"
                icon={<UserDeleteOutlined />}
                onClick={this.onDelete}
              >
                Eliminar
              </Button>
            ) : null}
          </Space>
          <Button
            loading={this.state.saving}
            disabled={!this.state.hasToSave}
            onClick={() => {
              // submit the form
              this.arpTable.current.formRef.current.submit();
            }}
            style={{ float: "right", marginLeft: "auto" }}
          >
            Guardar cambios
          </Button>
        </Space>
        {this.props.visible ? (
          <EditableTable
            ref={this.arpTable}
            dataSource={[...data]}
            saveRef={this.arpActions}
            hasChange={this.onChange}
            toSave={this.onSaveChanges}
            actionType={this.state.actionType}
            setActionsProps={this.onSetAction}
          />
        ) : null}
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  let arpStaff = [];
  if (
    state.staff.payload !== null &&
    state.staff.payload.arpStaff !== undefined
  ) {
    arpStaff = state.staff.payload.arpStaff;
  }

  return {
    loading: state.staff.loading,
    error: state.staff.error,
    arpStaff: arpStaff,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actionARPStaff: (type, data) => {
      if (type === "create") {
        dispatch(createARPStaff(data));
      } else {
        if (type === "edit") {
          dispatch(updateARPStaff(data));
        } else if (type === "delete") {
          dispatch(deleteARPStaff(data));
        }
      }
    },
    getARPStaff: () => dispatch(getARPStaff()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ARPStaff);
