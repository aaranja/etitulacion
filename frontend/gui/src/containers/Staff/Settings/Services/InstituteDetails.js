import React, {Component} from "react";
import {getInstituteData, updateInstituteData} from "../../../../store/actions/staff";
import {connect} from "react-redux";
import {CloseOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import {
    Button, Card,
    Descriptions,
    Form,
    Input,
    PageHeader,
    message,
    Space,
    Tag,
} from "antd";

class InstituteDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            hasChanges: false,
            canNext: false,
            saving: false,
            hasToSave: false,
            savingData: {}
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {saving, hasChanges, hasToSave} = this.state;
        if (saving) {
            //    if is saving and get update, get the updated props
            if (this.props.saved) {
                message.success(
                    `Datos guardados`
                );
                this.setState({saving: false, editing: false})
            }
        }

    }

    componentDidMount() {
        this.props.getInstituteData();
    }

    onSave = (values) => {
        // get id to save
        values['id'] = this.props.instituteData.id !== undefined ? this.props.instituteData.id : null
        this.props.updateInstituteDate(values)
        this.setState({
            hasChanges: false,
            saving: true,
            hasToSave: true,
            savingData: values,
        })
    };

    render() {
        let lastIndex = 0;
        const updateIndex = () => {
            lastIndex++;
            return lastIndex;
        };

        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10},
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 16,
                offset: 8,
            },
        };

        const editing = this.state.editing;
        return (
            <div>
                <PageHeader title="Datos del Instituto"
                            subTitle="Configuración"
                            extra={[
                                <Space direction="horizontal" key={updateIndex()}>
                                    <Button

                                        danger icon={<CloseOutlined/>}
                                        onClick={() => this.setState({editing: false})}
                                        style={{display: editing ? "block" : "none"}}>Cancelar
                                        edición
                                    </Button>
                                    <Button disabled={editing} icon={<EditOutlined/>}
                                            onClick={() => this.setState({editing: true,})}>Editar
                                        datos
                                    </Button>
                                </Space>]}
                >
                    <Descriptions size="small" column={1}>
                        <Descriptions.Item label={<b>Información</b>}>
                            Los datos del instituto se utilizan para generar la constancia de no inconvenientes y la
                            certificación de acta de examen profesional.
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <Card loading={this.props.loadingData}
                      style={{marginLeft: 25, marginRight: 120, paddingBottom: 20, boxShadow: "1px 3px 1px #9E9E9E",}}
                >
                    <fieldset disabled={!this.state.editing}>
                        <Form
                            {...formItemLayout}
                            onChange={() => {
                                if (!this.state.hasChanges) {
                                    this.setState({
                                        hasChanges: true,
                                    });
                                }
                            }}
                            initialValues={this.props.instituteData}
                            onFinish={this.onSave}
                            name="institute"
                            validateMessages={null}
                            scrollToFirstError
                            // initialValues={this.props.account.payload}
                        >
                            <Form.Item

                                key={updateIndex()}
                                name="institute"
                                label="Instituto"
                                hasFeedback
                            >
                                <Input placeholder="Instituto" size="large" bordered={editing}/>
                            </Form.Item>
                            <Form.Item
                                label="Clave"
                                key={updateIndex()}
                                name="code"
                                hasFeedback
                            >
                                <Input placeholder="Clave" size="large" bordered={editing}/>
                            </Form.Item>
                            <Form.Item
                                key={updateIndex()}
                                label="Ciudad"
                                name="city"
                                hasFeedback
                            >
                                <Input placeholder="Ciudad" size="large" bordered={editing}/>
                            </Form.Item>
                            <Form.Item
                                key={updateIndex()}
                                name="services_lead"
                                label="J. S. Escolares"
                            >
                                <Input placeholder="Nombre del jefe(a) de servicios escolares"
                                       size="large"
                                       bordered={editing}/>
                            </Form.Item>
                            <Form.Item
                                key={updateIndex()}
                                name="director"
                                label="Director"
                            >
                                <Input placeholder="Nombre del director" size="large" bordered={editing}/>
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout} key={updateIndex()}>
                                <Space>
                                    <Button
                                        key={updateIndex()}
                                        disabled={!this.state.hasChanges}
                                        htmlType="submit"
                                        form="institute"
                                        icon={<SaveOutlined/>}
                                        loading={this.state.saving}
                                    >
                                        Guardar
                                    </Button>
                                    <Tag visible={this.state.hasChanges} key="3">
                                        Tienes cambios sin guardar
                                    </Tag>
                                </Space>
                            </Form.Item>
                        </Form>
                    </fieldset>
                </Card>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    let instituteData = {}
    let loadingData = false;
    let saved = false;
    const {payload} = state.dataStaff
    if (payload !== null) {
        if (payload['institute'] !== undefined) {
            let institute = payload['institute']
            loadingData = institute.status === "loading" && institute.action === "get"
            if (institute.status === "success") {
                //    data loaded
                instituteData = institute.data
                saved = institute.action === "put"
            }
        } else {
            loadingData = true
        }
    }
    return {instituteData: instituteData, loadingData: loadingData, saved: saved}
}


const mapDispatchToProps = (dispatch) => {
    return {
        getInstituteData: () => dispatch(getInstituteData()),
        updateInstituteDate: (values) => dispatch(updateInstituteData(values)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstituteDetails);
