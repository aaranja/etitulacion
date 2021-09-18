import React, { Component } from "react";
import { Divider, Input, Card, Radio, Space, Button } from "antd";
import careerTypes from "../../../const/careerTypes";
const { Search } = Input;

class SiderbarList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: { career: null, status: null, search: "" },
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

    return (
      <Card
        style={{
          overflow: "auto",
          overflowY: "scroll",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          minWidth: 250,
          maxHeight: "90vh",
          width: 350,
          minHeight: "89vh",
          left: 170,
          padding: 0,
          backgroundColor: "white",
        }}
      >
        <Divider orientation="left">Buscar egresado</Divider>
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

        <Divider orientation="left">Filtrar por: </Divider>
        <Space direction="vertical">
          <Card
            size="small"
            title="Licenciatura"
            extra={cancelButton("career")}
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
            title="Documentación"
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
                <Radio value="STATUS_04">Rechazada</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Space>
      </Card>
    );
  }
}

export default SiderbarList;
