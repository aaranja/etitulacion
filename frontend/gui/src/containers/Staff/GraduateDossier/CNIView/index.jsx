import React, {Component} from "react";
import {graduate_status_services} from "../../../../site/collections/staffStatus";
import {Button, Card, Form, Input, Space} from "antd";
import {connect} from "react-redux";
import * as actions from "../../../../store/actions/staff";
import {DownloadOutlined, LinkOutlined} from "@ant-design/icons";
import PDFModal from "../../../../components/PDFModal";

const {TextArea} = Input;

class CNIView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notify: false,
            approval: false,
            currentView: "table",
            previewVisible: false,
            metaFileOnView: null,
            arrayFileOnView: null,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.viewDocument !== this.props.viewDocument &&
            this.state.metaFileOnView !== null
        ) {
            console.log(this.props.viewDocument.data);
            this.setState({
                previewVisible: true,
                arrayFileOnView: this.props.viewDocument.data,
            });
        }
    }

    onApproval = (value, type) => {
        this.setState({
            loading: true,
            approval: type === "success",
            notify: type === "error",
        });
        this.props.setApproval(this.props.graduatePK, value, type);
    };

    setCurrentView = (view, title) => {
        if (view === "table") {
            this.props.reset("document");
        }

        this.setState({
            currentView: view,
            title: title,
        });
    };

    onShowPreview = (visible, file) => {
        if (visible) {
            //   get file from sever
            this.setState({
                metaFileOnView: file,
            });
            this.props.getDocument(this.props.graduatePK, "CDNI");
        } else {
            this.setState({
                previewVisible: visible,
                metaFileOnView: null,
                arrayFileOnView: null,
            });
        }
    };

    render() {
        const approval_form = () => {
            return (
                <>
                    <Card.Meta
                        description={
                            "Validación. (*Aprobar el expediente generará automaticamente la constancia de no inconveniencia)"
                        }
                        style={{margin: 5}}
                    />
                    <Form
                        ref={this.form}
                        name="approval"
                        onFinish={(values) => {
                            this.onApproval(values.comment, "error");
                        }}
                    >
                        <Space direction="vertical" style={{width: "100%"}}>
                            <Form.Item
                                name="comment"
                                key={1}
                                rules={[
                                    {
                                        required: true,
                                        message: "No puedes dejar este campo vacío.",
                                    },
                                ]}
                            >
                                <TextArea rows={6}/>
                            </Form.Item>
                            <Space
                                direction="horizontal"
                                style={{
                                    float: "right",
                                }}
                            >
                                <Button
                                    danger
                                    loading={this.state.notify}
                                    htmlType="submit"
                                    form="approval"
                                >
                                    Notificar
                                </Button>

                                <Button
                                    type="primary"
                                    loading={this.state.approval}
                                    onClick={() =>
                                        this.onApproval("Trámite aprobado.", "success")
                                    }
                                >
                                    Aprobar
                                </Button>
                            </Space>
                        </Space>
                    </Form>
                </>
            );
        };
        const procedure_type = (status) => {
            let graduate_status = graduate_status_services[status];
            if (graduate_status === undefined)
                graduate_status = {procedure_type: "validated"};
            switch (graduate_status.procedure_type) {
                case "none":
                    return null;
                case "validate":
                    return approval_form();
                default:
                    return (
                        <>
                            <div style={{flexDirection: "row"}}>
                                <Button
                                    type="link"
                                    icon={<LinkOutlined/>}
                                    onClick={() =>
                                        this.onShowPreview(true, {
                                            name: "Carta de NO inconvenciencia",
                                        })
                                    }
                                >
                                    Carta de no inconveniencia.
                                </Button>
                                <Space direction={"horizontal"} style={{float: "right"}}>
                                    <Button type="primary" icon={<DownloadOutlined/>}>
                                        Descargar
                                    </Button>
                                </Space>
                            </div>
                        </>
                    );
            }
        };
        return (
            <div>
                <Card style={{boxShadow: "1px 3px 1px #9E9E9E",}}>
                    {procedure_type(this.props.status)}
                    <PDFModal
                        onClose={() => this.onShowPreview(false, null)}
                        file={this.state.arrayFileOnView}
                        previewVisible={this.state.previewVisible}
                        metadata={this.state.metaFileOnView}
                    />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let viewDocument = null;
    let currentState = state.staff;
    if (currentState.payload !== null) {
        if (currentState.payload.document !== undefined) {
            if (currentState.payload.document !== null) {
                viewDocument = currentState.payload.document;
            }
        }
    }

    return {
        viewDocument: viewDocument,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        reset: (type) => dispatch(actions.resetData(type)),
        setApproval: (enrollment, message, type) =>
            dispatch(actions.setApproval(enrollment, message, type)),
        getDocument: (enrollment, keyName) => {
            dispatch(actions.getDocument(enrollment, keyName));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CNIView);
