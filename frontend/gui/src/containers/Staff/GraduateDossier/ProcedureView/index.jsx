import React, {Component} from "react";
import {Button, Card, Space, Timeline, Typography} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import moment from "moment";
import CurrentProcedure from "./CurrentProcedure";
import ServicesProcedure from "./ServicesProcedure";
import CNIView from "../CNIView";
import AEPProcess from "./AEPProcess";

class ProcedureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentHistory: null,
        };
    }

    render() {
        const historyTime = this.props.history.map((record) => {
            let content_services = () => {
                switch (record["last_status"]) {
                    case "STATUS_04":
                        return (
                            <CNIView
                                graduatePK={this.props.graduatePK}
                                status={"STATUS_06"}
                            />
                        );
                    case "STATUS_14":
                        return (
                            <AEPProcess
                                graduatePK={this.props.graduatePK}
                                status={"STATUS_15"}
                            />
                        );
                    default:
                        return null;
                }
            };

            return (
                <Timeline.Item key={record.id}>
                    <Space direction="vertical" style={{width: "100%"}}>
                        <Typography.Text type="secondary">
                            {moment(record.time).format(
                                " dddd DD [de] MMMM [de] YYYY | HH:mm"
                            )}
                        </Typography.Text>
                        <Typography.Text>{record["information"]}</Typography.Text>
                        {this.props.user === "USER_SERVICES" ? content_services() : null}
                    </Space>
                </Timeline.Item>
            );
        });

        return (
            <div
                style={{
                    marginLeft: 25,
                    margin: 5,
                    borderRadius: "4px",
                    width: "100%",
                }}
            >
                <Card
                    style={{width: "100%",}}
                    title={<Typography.Title level={5}>Trámite</Typography.Title>}
                    bordered={false}
                    bodyStyle={{marginLeft: 15}}
                    extra={[
                        <Button key="download" type={"text"} icon={<ReloadOutlined/>}>
                            Actualizar
                        </Button>,
                    ]}
                >
                    <Timeline mode={"left"}>
                        {this.props.user === "USER_COORDINAT" ? (
                            <CurrentProcedure
                                status={this.props.status}
                                graduatePK={this.props.graduatePK}
                            />
                        ) : (
                            <ServicesProcedure
                                status={this.props.status}
                                graduatePK={this.props.graduatePK}
                            />
                        )}
                        {historyTime}
                    </Timeline>
                </Card>
            </div>
        );
    }
}

export default ProcedureView;
