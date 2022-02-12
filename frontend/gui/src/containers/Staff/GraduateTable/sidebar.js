import React, { Component } from "react";
import { Divider, Input, Card, Radio, Space, Button, Menu } from "antd";
import careerTypes from "../../../site/collections/careerTypes";
import { CarryOutOutlined, MailOutlined } from "@ant-design/icons";

const { Search } = Input;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: { career: null, status: null, search: "" },
      currentView: "1",
    };
  }

  onFilterClean = () => {
    this.setState({
      filters: { career: null, status: null },
    });
  };

  onSelectFilter = (filter, type) => {
    // get filter value (status or career), if is null, set null
    let value = filter !== null ? filter.target.value : null;
    // get state filters
    let filters = this.state.filters;
    // set the new value filter in his type filter
    filters[type] = value;
    // change state and send to parent to charge the new data
    this.setState({ filters: filters });
    this.props.setFilters(filters);
  };

  render() {
    const cancelButton = (type) => {
      if (this.state.filters[type] !== null) {
        return (
          <Button
            type="link"
            onClick={() => {
              this.onSelectFilter(null, type);
            }}
          >
            Cancelar
          </Button>
        );
      } else {
        return null;
      }
    };

    const extra_options = (usertype) => {
      switch (usertype) {
        case "USER_COORDINAT":
          return (
            <>
              <Divider>Menú</Divider>
              <Menu
                style={{}}
                defaultSelectedKeys={[this.state.currentView]}
                mode="vertical"
                theme="light"
              >
                <Menu.Item key="1" icon={<MailOutlined />}>
                  Lista de egresados
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<MailOutlined />}
                  onClick={() => {
                    // send keyname to change the current view
                    this.props.menuAction("inauguration");
                  }}
                >
                  Fechas de toma de protesta
                </Menu.Item>
                <Menu.Item
                  key="3"
                  icon={<CarryOutOutlined />}
                  onClick={() => {
                    // send keyname to change the current view
                    this.props.menuAction("arp");
                  }}
                >
                  Acto de recepción profesional
                </Menu.Item>
              </Menu>
            </>
          );
        case "USER_SERVICES":
          return null;
        default:
          return null;
      }
    };

    return (
      <Card style={{ borderLeft: 0, borderTop: 0, borderBottom: 0 }}>
        {extra_options(this.props.usertype)}
        <Divider>Buscar egresado</Divider>
        <Search
          placeholder="Introduce nombre o matrícula"
          onSearch={(text) => {
            let filters = this.state.filters;
            filters.search = text;
            this.setState({
              filters: filters,
            });
            this.onSelectFilter({ target: { value: text } }, "search");
          }}
        />

        <Space direction="vertical">
          <Divider style={{ marginBottom: 0 }}>Filtros</Divider>
          <Card
            size="small"
            title="Licenciatura"
            bordered={false}
            extra={cancelButton("career")}
            style={{ marginTop: 0 }}
          >
            <Radio.Group
              onChange={(value) => this.onSelectFilter(value, "career")}
              size="small"
              value={this.state.filters.career}
            >
              <Space direction="vertical">
                <Radio value="electromecanica">
                  {careerTypes.electromecanica}
                </Radio>
                <Radio value="electronica">{careerTypes.electronica}</Radio>
                <Radio value="gestion">{careerTypes.gestion}</Radio>
                <Radio value="industrial">{careerTypes.industrial}</Radio>
                <Radio value="sistemas">{careerTypes.sistemas}</Radio>
                <Radio value="mecatronica">{careerTypes.mecatronica}</Radio>
                <Radio value="administracion">
                  {careerTypes.administracion}
                </Radio>
              </Space>
            </Radio.Group>
          </Card>
          <Card
            size="small"
            title="Estatus"
            bordered={false}
            extra={cancelButton("status")}
          >
            <Radio.Group
              onChange={(value) => this.onSelectFilter(value, "status")}
              size="small"
              value={this.state.filters.status}
            >
              <Space direction="vertical">
                <Radio value="STATUS_05">Por revisar</Radio>
                <Radio value="STATUS_02">Sin cargar</Radio>
                <Radio value="STATUS_06">Aprobada</Radio>
                <Radio value="STATUS_10">Rechazada</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Space>
      </Card>
    );
  }
}

export default Sidebar;
