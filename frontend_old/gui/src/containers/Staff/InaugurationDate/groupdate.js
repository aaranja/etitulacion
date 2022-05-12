import React, { Component } from "react";
import { Drawer, Button, Space, Popconfirm, message, Tag, Tooltip } from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import GroupDateForm from "./GroupDateForm";
import { connect } from "react-redux";
import {
  createGroupDate,
  deleteGroupDate,
  updateGroupDate,
} from "../../../store/actions/staff";
import GroupDateInfo from "./GroupDateInfo";

class GroupDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      infoData: this.props.dataSource,
      // show form if  action type is create
      showForm: this.props.type === "create",
      hasToSaved: false,
      saving: false,
      type: this.props.type,
      deleting: false,
      formData: null,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.hasToSaved) {
      // if it has something to save
      this.props.saveGroupDate(
        this.state.savingData.values,
        this.state.savingData.type
      );
      this.setState({ hasToSaved: false });
    } else {
      if (this.props.loading !== prevProps.loading && !this.props.loading) {
        // if is saving
        if (this.props.error === null) {
          if (this.state.saving) {
            message.success("Datos guardados");
            // set changes saved
            this.setState({ saving: false, infoData: this.props.infoData });
            this.props.saved(this.props.infoData);
          } else if (this.state.deleting) {
            message.success("Grupo eliminado");
            // if is deleting
            this.setState({ deleting: false, infoData: {} });
            this.props.delete(this.state.infoData.id);
          }
        } else {
          console.log("ha ocurrido un error");
          console.log("error", this.props.error);
          this.setState({
            saving: false,
          });
        }
      } else {
        if (this.props.type !== prevProps.type) {
          this.setState({
            visible: this.props.visible,
            showForm: this.props.type === "create",
            type: this.props.type,
            infoData: this.props.dataSource,
            formData: null,
          });
        }
      }
    }
  }

  onSave = (values, type) => {
    this.setState({
      hasToSaved: true,
      saving: true,
      savingData: { values: values, type: type },
    });
  };

  onCancel = () => {
    if (this.state.type === "create") {
      // close component if is creating
      this.props.disable();
    } else {
      // hidden form
      this.setState({
        showForm: false,
        formData: null,
        // infoData: this.props.dateGroupInfo,
      });
    }
  };

  onShowForm = () => {
    let formData = {
      groupInfo: this.state.infoData,
      groupGraduate: [...this.props.dateGroupInfo],
    };
    this.setState({
      showForm: true,
      formData: { formData },
    });
  };

  onDelete = () => {
    this.setState({
      hasToSaved: true,
      deleting: true,
      savingData: { values: this.state.infoData, type: "delete" },
    });
  };

  onCreateARP = () => {
    this.props.callBack("arp", this.state.infoData);
  };

  render() {
    const content = (option) => {
      if (option)
        return (
          <GroupDateForm
            onSaveGroupDate={this.onSave}
            initialData={this.state.formData}
          />
        );
      else return <GroupDateInfo initialData={this.state.infoData} />;
    };

    return (
      <Drawer
        title="Datos de fecha"
        footer={[
          <Space
            key="info-options"
            direction="horizontal"
            style={{
              display: `${!this.state.showForm ? "flex" : "none"}`,
              justifyContent: "space-between",
            }}
          >
            <Popconfirm
              placement="bottomRight"
              title="Estás seguro de eliminar este grupo"
              onConfirm={this.onDelete}
              okText="Si"
              cancelText="No"
            >
              <Button
                key="del"
                icon={<DeleteOutlined />}
                type="text"
                danger
                style={{ float: "left", marginRight: "auto" }}
              >
                Eliminar
              </Button>
            </Popconfirm>
            <Space direction="horizontal">
              <Tooltip title="No se ha alcanzado la fecha disponible para crear el ARP">
                <Tag color="default" style={{ border: 0 }}>
                  No disponible
                </Tag>
              </Tooltip>

              <Button
                key="arp"
                icon={<CalendarOutlined />}
                type="default"
                style={{ float: "right" }}
                onClick={this.onCreateARP}
              >
                Crear ARP
              </Button>
            </Space>
          </Space>,
        ]}
        placement="right"
        closable={true}
        onClose={this.props.disable}
        visible={this.state.visible}
        getContainer={false}
        style={{ position: "absolute", height: "100%" }}
        extra={[
          <Space
            key="info-options"
            direction="horizontal"
            style={{
              display: `${!this.state.showForm ? "flex" : "none"}`,
            }}
          >
            <Button
              key="edit"
              icon={<EditOutlined />}
              onClick={this.onShowForm}
            >
              Editar
            </Button>
          </Space>,
          <Space
            key="update-options"
            direction="horizontal"
            style={{
              display: `${this.state.showForm ? "flex" : "none"}`,
            }}
          >
            <Button
              key="save"
              htmlType="submit"
              form="group-date-form"
              icon={<SaveOutlined />}
              type="primary"
              loading={this.state.saving}
            >
              Guardar
            </Button>
            <Button
              key="cancel"
              icon={<CloseOutlined />}
              onClick={this.onCancel}
            >
              Cancelar
            </Button>
          </Space>,
        ]}
        width={this.state.showForm ? "100%" : "50%"}
      >
        {content(this.state.showForm)}
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  let dateGroupInfo = [];
  let infoData = [];
  if (state.staff.payload !== null) {
    if (state.staff.payload.dateGroupInfo !== undefined) {
      dateGroupInfo = state.staff.payload.dateGroupInfo;

      for (let index in dateGroupInfo) {
        dateGroupInfo[index].key = dateGroupInfo[index].enrollment;
      }
      infoData = state.staff.payload.groupDate;
    }
  }
  return {
    loading: state.staff.loading,
    error: state.staff.error,
    infoData: infoData,
    dateGroupInfo: dateGroupInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveGroupDate: (values, type) => {
      switch (type) {
        case "delete":
          dispatch(deleteGroupDate(values));
          break;
        case "update":
          dispatch(updateGroupDate(values));
          break;
        case "create":
          dispatch(createGroupDate(values));
          break;
        default:
          return null;
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDate);
