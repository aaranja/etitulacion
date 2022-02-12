import React from "react";
import { Steps, Divider, Card } from "antd";

const { Step } = Steps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.current,
      currentFinished: props.currentFinished,
    };
  }

  onChange = (current) => {
    this.props.callbackFromParent(current);
    this.setState({ current });
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.currentFinished !== nextProps.currentFinished;
  }

  status = (key) => {
    if (key < this.props.currentFinished) {
      return "finish";
    } else {
      if (key === this.props.currentFinished) {
        return "process";
      } else {
        return "wait";
      }
    }
  };

  render() {
    return (
      <Card
        style={{ borderLeft: 0, borderBottom: 0, borderTop: 0, minWidth: 300 }}
      >
        <Divider
          orientation="center"
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          Progreso
        </Divider>

        <Steps
          current={this.state.currentFinished}
          direction="vertical"
          style={{
            paddingLeft: "8%",
            borderRight: "0",
            height: 500,
          }}
        >
          <Step
            title="Información"
            description="Valida tus datos personales"
            status={this.status(0)}
          />
          <Step
            title="Expediente"
            description="Carga la documentación requerida"
            status={this.status(1)}
          />
          <Step
            title="Validación"
            description="Tu expediente entrará en proceso de revisión"
            status={this.status(2)}
          />
          <Step
            title="Toma de protesta"
            description="Fecha de asignación y asistencia"
            status={this.status(3)}
          />
          <Step
            title="Liberación"
            description="S.E. enviará tu Acta de Examen Profesional"
          />
        </Steps>
      </Card>
    );
  }
}

export default Sidebar;
