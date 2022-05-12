import React, { Component } from "react";
import { Button, Card, Timeline, Typography } from "antd";
import ValidationView from "../ValidationView";

class CurrentProcedure extends Component {
  render() {
    let view = {
      title: null,
      current: null,
    };
    switch (this.props.status) {
      case "STATUS_06":
      case "STATUS_07":
        view = {
          title: "Validación de expediente",
          current: <ValidationView graduatePK={this.props.graduatePK} />,
        };
        break;
      case "STATUS_08":
      case "STATUS_09":
      case "STATUS_10":
        view = {
          title: "Asignar fecha de toma de protesta",
          current: (
            <>
              Este egresado no tiene asignada una fecha de toma de protesta.
              Haga click
              <Button
                type="link"
                href={
                  "http://localhost:3000/home/coordination/inauguration-dates/"
                }
              >
                aquí
              </Button>
              para dirigirse a esa sección.
            </>
          ),
        };
        break;
      case "STATUS_11":
        view = {
          title: "Crear datos de Acto de Recepción Profesional",
          current: (
            <>
              Este egresado no tiene rellenados sus datos de ARP. Haga click
              <Button
                type="link"
                href={
                  "http://localhost:3000/home/coordination/inauguration-dates/"
                }
              >
                aquí
              </Button>
              para dirigirse a la sección de fechas de toma de protesta, para
              crearlos.
            </>
          ),
        };
        break;
      case "STATUS_12":
        view = {
          title: "Confirmar asistencia al Acto de Recepción Profesional",
          current: (
            <>
              Este egresado no tiene confirmada su asistencia al Acto de
              Recepción Profesional. Haga
              <Button
                type="link"
                href={"http://localhost:3000/home/coordination/arp-dates/"}
              >
                aquí
              </Button>
              para dirigirse a la sección de ARP para confirmar la asistencia de
              su grupo.
            </>
          ),
        };
        break;
      case "STATUS_13":
        view = {
          title: "Liberación de Acta de Examen Profesional pendiente",
          current: (
            <>
              El departamento de servicios escolares aún no libera el acta de
              examen profesional de este egresado.
            </>
          ),
        };
        break;
      default:
        return null;
    }

    return (
      <Timeline.Item position={"right"}>
        <Typography.Title level={5}>{view.title}</Typography.Title>
        <Card style={{ margin: 10, width: "100%" }}>{view.current}</Card>
      </Timeline.Item>
    );
  }
}

export default CurrentProcedure;
