import React, { Component } from "react";
import { Timeline, Typography } from "antd";
import CNIView from "../CNIView";
import AEPProcess from "./AEPProcess";
import {
  AuditOutlined,
  ClockCircleOutlined,
  ExceptionOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

class ServicesProcedure extends Component {
  render() {
    let view;
    switch (this.props.status) {
      case "STATUS_00":
      case "STATUS_01":
      case "STATUS_02":
        view = {
          title: "Trámite no iniciado",
          current: (
            <>
              Este egresado no cumple con los requisitos para iniciar el
              trámite. Expediente incompleto.
            </>
          ),
          dot: null,
        };
        break;
      case "STATUS_03":
      case "STATUS_04":
        view = {
          title: "Validación de expediente",
          current: (
            <CNIView
              graduatePK={this.props.graduatePK}
              status={this.props.status}
            />
          ),
          dot: <FileSearchOutlined />,
        };
        break;
      case "STATUS_05":
        view = {
          title: "Expediente rechazado.",
          current: (
            <>
              Este egresado tiene errores en su expediente. Espere hasta a que
              el expediente sea corregido.
            </>
          ),
          dot: <ExceptionOutlined />,
        };
        break;
      case "STATUS_06":
        view = {
          title: "Pendiente validación.",
          current: (
            <>
              Expendiente pendiente por se validado por Coordinación de
              Titulación.
            </>
          ),
          dot: <FileSearchOutlined />,
        };
        break;
      case "STATUS_07":
      case "STATUS_08":
      case "STATUS_09":
      case "STATUS_10":
        view = {
          title: "Expediente aprobado por coordinación de titulación.",
          current: (
            <>
              El expediente de este egresado a sido aprobado por coordinación de
              titulación. Está en espera de la asignación de fecha de toma de
              protesta.
            </>
          ),
          dot: <FileDoneOutlined />,
        };
        break;
      case "STATUS_11":
      case "STATUS_12":
        view = {
          title: "Confirmación de asistencia pendiente.",
          current: (
            <>
              Este egresado tiene una fecha de toma de protesta asignada, espere
              a la confirmación de la asistencia al Acto de Recepción
              Profesional para ver los datos.
            </>
          ),
          dot: <ClockCircleOutlined />,
        };
        break;
      case "STATUS_13":
      case "STATUS_14":
        view = {
          title: "Liberación de Acta de Examen Profesional disponible.",
          current: (
            <AEPProcess
              graduatePK={this.props.graduatePK}
              status={this.props.status}
            />
          ),
          dot: <AuditOutlined />,
        };
        break;
      default:
        view = {
          title: null,
          current: null,
          dot: null,
        };
    }

    return view.current !== null ? (
      <Timeline.Item position={"right"} dot={view.dot}>
        <Typography.Title level={5} code>
          {view.title}
        </Typography.Title>
        <div style={{ width: "100%" }}>{view.current}</div>
      </Timeline.Item>
    ) : null;
  }
}

export default ServicesProcedure;
