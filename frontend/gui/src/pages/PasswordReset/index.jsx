import React, {Component} from "react";
import {Alert, Button, Card, Form, Input, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {auth} from "../../store/services/auth";
import {connect} from "react-redux";
import withRouter from "../../routes/withRouter/withRouter";


class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: null,
        }

        console.log(this.props)

    }

    rules = (textString) => {
        return [{
            required: true, message: "Por favor introduce un " + textString + "!",
        },];
    };

    onFinish = (values) => {
        this.setState({
            form: values,
        })
        this.props.onEmailConfirm(values)
    }


    render() {

        const layout = {
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const tailLayout = {
            wrapperCol: {
                offset: 5,
                span: 16,
            },
        };

        let result = this.props.confirmation(this.state.form)
        console.log(result)

        return <div
            style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                marginTop: "50px",
                flexDirection: "column"
            }}>
            <Typography.Title level={3}>Cambiar contraseña</Typography.Title>
            <Card style={{width: "36em"}}>
                <Typography.Paragraph>Introduce la dirección asociada tu cuenta de etitulación.</Typography.Paragraph>
                {result.isError ? (<Alert
                    type="error"
                    style={{marginBottom: "5px"}}
                    message={result.error.data['email']}
                    closable={true}
                />) : null}
                {result.isSuccess ? (<Alert
                    type="success"
                    style={{marginBottom: "5px"}}
                    message={result.data['detail']}
                    closable={true}
                />) : null}
                <Form {...layout} onFinish={this.onFinish}>
                    <Form.Item name="email" rules={this.rules("correo electrónico")} label="E-mail">
                        <Input
                            size="large"
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="Correo electrónico"
                        />
                    </Form.Item>
                    <Form.Item {...tailLayout} style={{display: "flex", flexDirection: "row"}} >
                        <Button type="primary" htmlType="submit" loading={result.isLoading}>
                            Confirmar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        confirmation: (data) => auth.endpoints.emailConfirmation.select(data)(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEmailConfirm: (data) => {
            dispatch(auth.endpoints.emailConfirmation.initiate(data))
        }
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordReset));