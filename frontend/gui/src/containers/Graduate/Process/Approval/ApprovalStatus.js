import React, {Component} from "react";
import {Button, Result, Typography, Modal, Space} from "antd";
import {
    ClockCircleOutlined,
    CloseCircleOutlined,
    DeliveredProcedureOutlined,
    SmallDashOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {userTypes} from "../../../../site/collections/userTypes";

const {Paragraph, Text} = Typography;
const {confirm} = Modal;

export class Wait extends Component {
    render() {
        return (
            <Result
                icon={<SmallDashOutlined/>}
                title="Validación no iniciada"
                subTitle="Asegurese de que toda su documentación e información sea correcta antes de iniciar la validación"
                extra={[
                    <Button
                        type="primary"
                        key="done"
                        icon={<DeliveredProcedureOutlined/>}
                        onClick={() => {
                            this.props.onPressButton("init", "Validación iniciada");
                        }}
                    >
                        Iniciar trámite
                    </Button>,
                ]}
            />
        );
    }
}

export class InProcess extends Component {
    cancel = (cancel) => {
        confirm({
            title: "Validación en proceso. ¿Desea cancelarlo?",
            icon: <ExclamationCircleOutlined/>,

            okText: "Si",
            okType: "danger",
            cancelText: "No",
            onOk() {
                cancel("cancel", "Validación cancelada");
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    render() {
        let extra = this.props.canCancel
            ? [
                <Button
                    key="done"
                    icon={<CloseCircleOutlined/>}
                    onClick={() => this.cancel(this.props.cancelAction)}
                >
                    Cancelar
                </Button>,
            ]
            : null;

        return (
            <Result
                icon={<ClockCircleOutlined/>}
                title="Validación en proceso"
                subTitle="Su expediente está en proceso de revisión. Espera a que este proceso sea completado."
                extra={extra}
            />
        );
    }
}

export class Fail extends Component {
    confirm = (resend) => {
        confirm({
            title: "Reenviar expediente.",
            icon: <ExclamationCircleOutlined/>,
            content:
                "Asegurese de haber corregido su expediente, no podrá cancelar este proceso.",
            okText: "Reenviar",
            okType: "primary",
            cancelText: "Cancelar",
            onOk() {
                resend("resend", "Expediente reenviado.");
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    render() {
        let notifications =
            this.props.notifications !== undefined ? this.props.notifications : [];

        return (
            <Result
                status="error"
                title="Expediente rechazado"
                subTitle="Ha ocurrido un error durante el trámite. Antes de reenviar el expediente, por favor siga las instrucciones."
                extra={[
                    <Button
                        key="modify"
                        onClick={() => {
                            this.props.goDocuments(1);
                        }}
                    >
                        Ver documentos
                    </Button>,
                    <Button
                        type="primary"
                        key="done"
                        onClick={() => {
                            this.confirm(this.props.resend);
                        }}
                    >
                        Reenviar expediente
                    </Button>,
                ]}
            >
                <div className="desc">
                    <Paragraph>
                        <Text
                            strong
                            style={{
                                fontSize: 16,
                            }}
                        >
                            Notificación:
                        </Text>
                    </Paragraph>
                    {notifications.map((notification) => {
                        return (
                            <Space key={notification.id} direction="vertical">
                                <Text type="secondary" italic>
                                    {moment(notification.time).format(
                                        "DD [de] MMMM [de] YYYY | HH:mm"
                                    )}
                                </Text>
                                {notification.message}
                                <Text italic code>
                                    {userTypes[notification.sender].info}
                                </Text>
                            </Space>
                        );
                    })}
                </div>
            </Result>
        );
    }
}

export class Success extends Component {
    render() {
        return (
            <Result
                status="success"
                title="Validación exitosa"
                subTitle={
                    <p>
                        Tu expediente ha sido aprobado. Avanza para ver la fecha de{" "}
                        <b>Toma de protesta.</b>
                    </p>
                }
            />
        );
    }
}
