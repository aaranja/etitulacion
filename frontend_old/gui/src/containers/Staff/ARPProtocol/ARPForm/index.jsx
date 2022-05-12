import React, { Component } from "react";
import EditableTable from "./EditableTable";
import {
  Button,
  Drawer,
  Popconfirm,
  Space,
  Tag,
  Modal,
  Descriptions,
  message,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import columns from "./columns";
import inputTypes from "./inputTypes";
import moment from "moment/moment";
import { connect } from "react-redux";
import {
  createARPGroup,
  deleteARPGroup,
  getARPGroup,
  saveARPGroup,
} from "../../../../store/actions/staff";

class ARPForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 2,
      visible: this.props.visible,
      create: this.props.create,
      saving: false,
      selecting: false,
      hasToSave: false,
      savingData: null,
      closeVisible: false,
      deleting: false,
    };
    this.editableTable = React.createRef();
    if (this.props.visible) {
      //  get the initial data
      if (this.props.initialData["arp_generated"]) {
        this.props.getARPData(this.props.initialData.id);
      } else {
        this.props.createARPData(this.props.initialData.id);
      }
    }
  }

  componentWillUnmount() {
    console.log("adios mundo cruel");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.hasToSave) {
      const { savingData } = this.state;
      if (this.props.arpGroup.date["arp_generated"]) {
        this.props.saveARPData(savingData);
      }
      this.setState({
        hasToSave: false,
        saving: true,
      });
    } else {
      if (this.props.loading !== prevProps.loading && !this.props.loading) {
        if (this.props.error === null) {
          if (this.state.saving && this.props.saved) {
            message.success("Datos guardados");
            // set changes saved
            this.editableTable.current.onSaved();
            this.setState({ saving: false });
          }

          if (this.state.deleting && this.props.deleted) {
            this.props.onDelete();
            // this.setState({ deleting: false });
          }
        } else {
          console.log("ha ocurrido un error");
          console.log("error", this.props.error);
          this.setState({
            saving: false,
          });
        }
      }
    }
  }

  onFinish = (full_data, changes, complete) => {
    let savingData = { data: null, complete: null };

    savingData.date = this.props.initialData;
    savingData.data = changes;
    savingData.complete = complete;
    savingData.assist = null;
    this.setState({
      hasToSave: true,
      saving: true,
      savingData: savingData,
    });
  };

  onDelete = () => {
    this.setState({
      deleting: true,
    });
    this.props.deleteARPGroup(this.props.initialData.id);
  };

  onCreateARP = () => {};
  onCancel = () => {
    if (this.editableTable.current.state.hasChanges) {
      this.setState({
        closeVisible: true,
      });
    } else {
      this.props.onClose(false);
    }
  };

  saveAndClose = () => {};

  onAssistConfirm = (value) => {
    let savingData = { data: null, complete: null };
    savingData.date = this.props.initialData;
    savingData.assist = value;

    this.setState({
      hasToSave: true,
      saving: true,
      savingData: savingData,
    });
  };

  render() {
    let dataColumns = columns();
    let load = !this.props.loadingArp && this.props.visible;
    let footer = load
      ? [
          <Space
            key="info-options"
            direction="horizontal"
            style={{
              display: `${
                this.props.arpGroup.date["arp_generated"] ? "flex" : "none"
              }`,
              justifyContent: "space-between",
            }}
          >
            <Popconfirm
              placement="bottomRight"
              title="Desea eliminar este grupo?"
              onConfirm={this.onDelete}
              okText="Si"
              cancelText="No"
            >
              <Button
                key="del"
                icon={<DeleteOutlined />}
                type="text"
                danger
                loading={this.state.deleting}
                style={{ float: "left", marginRight: "auto" }}
              >
                Eliminar grupo
              </Button>
            </Popconfirm>
          </Space>,
        ]
      : null;

    let extra = load
      ? [
          <Space
            key="info-options"
            direction="horizontal"
            style={{
              display: `${!this.state.create ? "flex" : "none"}`,
            }}
          >
            <Popconfirm
              title={"Datos ARP incompletos"}
              disabled={this.props.arpGroup.date["arp_complete"]}
              okText={"Ok"}
              cancelText={"Cancelar"}
              placement={"bottomRight"}
              onConfirm={() =>
                this.onAssistConfirm(!this.props.arpGroup.date["confirmed"])
              }
            >
              <Button
                key="save"
                form="group-date-form"
                icon={<ScheduleOutlined />}
                type="primary"
                style={{
                  display: this.props.arpGroup.date["confirmed"]
                    ? "none"
                    : "block",
                }}
                disabled={this.state.saving}
                onClick={() => {
                  this.props.arpGroup.date["arp_complete"]
                    ? this.onAssistConfirm(
                        !this.props.arpGroup.date["confirmed"]
                      )
                    : console.log("datos no completos");
                }}
              >
                Confirmar asistencia
              </Button>
            </Popconfirm>

            <Button
              key="cancel-assist"
              type="danger"
              disabled={this.state.saving}
              icon={<CalendarOutlined />}
              style={{
                display: !this.props.arpGroup.date["confirmed"]
                  ? "none"
                  : "block",
              }}
              onClick={() => {
                this.onAssistConfirm(!this.props.arpGroup.date["confirmed"]);
              }}
            >
              {"Cancelar asistencia"}
            </Button>

            <Button
              type="text"
              key="edit"
              icon={<CloseOutlined />}
              onClick={this.onCancel}
            >
              Salir
            </Button>
          </Space>,
        ]
      : [
          <Button
            type="text"
            key="edit"
            icon={<CloseOutlined />}
            onClick={this.onCancel}
          >
            Salir
          </Button>,
        ];

    return (
      <Drawer
        title={
          <Typography.Text>
            {" "}
            Datos ARP <LoadingOutlined hidden={!this.state.saving} />
          </Typography.Text>
        }
        width="100%"
        getContainer={false}
        style={{ position: "absolute", height: "100%" }}
        closable={false}
        visible={this.props.visible}
        footer={footer}
        extra={extra}
      >
        {load ? (
          <>
            <Descriptions
              style={{ paddingTop: 10, paddingBottom: 10 }}
              layout="vertical"
              col="1"
            >
              <Descriptions.Item label="ID">
                {this.props.arpGroup.date["id"]}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha">
                {moment(this.props.arpGroup.date["date"]).format(
                  "DD [de] MMMM [de] YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Asistencia">
                {this.props.arpGroup.date["confirmed"] ? (
                  <Tag color={"#87d068"}>Confirmada</Tag>
                ) : (
                  <Tag> Sin confirmar</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
            <Typography style={{ paddingBottom: 10 }}>
              <Typography.Text>Lista de egresados: </Typography.Text>
            </Typography>
            <EditableTable
              arpStaffOption={this.props.arpStaff}
              ref={this.editableTable}
              onFinish={this.onFinish}
              initialData={[...this.props.arpGroup["graduateList"]]}
              columns={dataColumns}
              inputTypes={inputTypes}
              selecting={this.state.selecting}
            />
            <Tag
              hidden={this.props.arpGroup.date["arp_complete"]}
              icon={<ExclamationCircleOutlined />}
              color="warning"
              style={{
                marginTop: 10,
              }}
            >
              Datos incompletos
            </Tag>
            <Modal
              visible={this.state.closeVisible}
              title="Desea guardar los cambios antes de salir?"
              onOk={() => this.props.onClose(false)}
              onCancel={() => {}}
              cancelText="Cancelar"
              okText="Salir de todas formas"
            >
              <p>Todos los cambios no guardados se perderán.</p>
            </Modal>
          </>
        ) : (
          <LoadingOutlined />
        )}
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  let data = [];
  let arpStaff = [];
  let loading = true;
  let saved = false;
  let deleted = false;
  if (state.staff.payload["arpStaff"] !== undefined) {
    if (state.staff.error === null) {
      arpStaff = state.staff.payload.arpStaff;
    }
  }

  let arpGroup = state.dataStaff.payload["arpGroup"];
  if (arpGroup !== undefined) {
    saved = arpGroup.status === "success" && arpGroup.action === "update";
    deleted = arpGroup.status === "success" && arpGroup.action === "delete";
    if (arpGroup.data !== null) {
      data = arpGroup.data;
      loading = data.length <= 0;
    }
  }

  return {
    loading: state.dataStaff.loading,
    error: state.dataStaff.error,
    arpGroup: data,
    loadingArp: loading,
    arpStaff: arpStaff,
    saved: saved,
    deleted: deleted,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getARPData: (id) => {
      dispatch(getARPGroup(id));
    },
    createARPData: (id) => {
      dispatch(createARPGroup(id));
    },
    saveARPData: (values) => {
      dispatch(saveARPGroup(values));
    },
    deleteARPGroup: (id) => {
      dispatch(deleteARPGroup(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ARPForm);
