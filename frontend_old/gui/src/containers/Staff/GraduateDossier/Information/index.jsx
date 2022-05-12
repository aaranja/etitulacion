import React, { Component } from "react";
import {
  Divider,
  Card,
  Descriptions,
  Space,
  List,
  Typography,
  Menu,
} from "antd";

import {
  ContainerOutlined,
  FolderOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "./documents-viewer.css";
import * as graduate_state from "../../utils";
import careerTypes from "../../../../site/collections/careerTypes";

const { Text } = Typography;

class Information extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      approval: false,
      notify: false,
    };
  }

  componentDidMount() {
    this.form = React.createRef();
  }

  componentWillUnmount() {
    this.setState({
      dataSource: [],
      loading: false,
      approval: false,
      notify: false,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.loading && this.state.loading) {
      this.form.current.resetFields();
      this.setState({
        loading: false,
        approval: false,
        notify: false,
      });
    }
  }

  getStatus = (status) => {
    if (this.props.user === "USER_COORDINAT") {
      return graduate_state.status_progress_coordination(status);
    } else {
      return graduate_state.status_progress_services(status);
    }
  };
  getTagStatus = (status) => {
    if (this.props.user === "USER_COORDINAT") {
      return graduate_state.status_tag_coordination(status);
    } else {
      return graduate_state.status_tag_services(status);
    }
  };

  getProcessType = (status) => {
    if (this.props.user === "USER_COORDINAT") {
    } else {
    }
  };

  onApproval = (value, type) => {
    this.setState({
      loading: true,
      approval: type === "success",
      notify: type === "error",
    });

    this.props.onApproval(value, type);
  };

  render() {
    return (
      <Card
        className="sider-search"
        style={{
          overflowY: "auto",
          overflow: "",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          minWidth: 250,
          width: 350,
          minHeight: "89vh",
          borderLeft: 0,
          borderBottom: 0,
          borderTop: 0,
          padding: 0,
          backgroundColor: "white",
        }}
      >
        {this.props.graduate !== null ? (
          <>
            <Descriptions
              column={1}
              style={{ marginLeft: 20 }}
              title="Información del egresado"
            >
              <Descriptions.Item label="Matrícula">
                {this.props.graduate.enrollment}
              </Descriptions.Item>
              <Descriptions.Item label="Nombre">
                {this.props.graduate.first_name}
              </Descriptions.Item>
              <Descriptions.Item label="Apellidos">
                {this.props.graduate.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Carrera">
                {careerTypes[this.props.graduate.career]}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text copyable={true}>{this.props.graduate.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="No. Celular">
                <Text>{this.props.graduate.cellphone}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Progreso">
                {this.getStatus(this.props.graduate.status)}
              </Descriptions.Item>
            </Descriptions>
            <Menu
              style={{ flex: 1 }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode={"inline"}
              theme={"light"}
            >
              <Menu.Item
                key="1"
                icon={<FolderOutlined />}
                onClick={() => this.props.setCurrentView("documents")}
              >
                Documentación
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<ContainerOutlined />}
                onClick={() => this.props.setCurrentView("procedure")}
              >
                Trámite
              </Menu.Item>
            </Menu>
            {/*{procedure_type(this.props.graduate.status)}*/}
            <Divider orientation="left">Notificaciones</Divider>
            <List
              size="small"
              bordered
              dataSource={this.props.graduate.notifications}
              renderItem={(item) => (
                <Space direction="vertical" style={{ display: "table-row" }}>
                  <Text key={item.id} style={{ width: 300, padding: 4 }}>
                    {item.message}
                  </Text>
                  <Text key={item.id} style={{ fontSize: "small", padding: 4 }}>
                    {item.time}
                  </Text>
                  <Divider style={{ margin: 5 }} />
                </Space>
              )}
            />
          </>
        ) : (
          <LoadingOutlined />
        )}
      </Card>
    );
  }
}

export default Information;
