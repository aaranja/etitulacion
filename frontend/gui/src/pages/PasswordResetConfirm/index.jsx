import React, {Component} from "react";
import withRouter from "../../routes/withRouter/withRouter";
import {Button, Card, Form, Input, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {connect} from "react-redux";
import {auth} from "../../store/services/auth";

class PasswordResetConfirm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: null,
        }
    }

    rules = (textString) => {
        return [{
            required: true, message: "Por favor introduce " + textString + "!",
        },];
    };

    onFinish = (values) => {

        values['uid'] = this.props.params.uid
        values['token'] = this.props.params.token

        this.setState({
            form: values,
        })

        this.props.onPasswordReset(values)
    }


    render() {

        let result = this.props.selectPaswordReset(this.state.form)
        console.log(result)
        return <div style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            marginTop: "50px",
            flexDirection: "column"
        }}>
            <Typography.Title level={3}>Restablecer contraseña</Typography.Title>
            <Card style={{width: "36em"}}>
                <Form onFinish={this.onFinish} labelWrap layout={"vertical"}>
                    <Form.Item name="new_password1" rules={this.rules(" tu nueva contraseña")} label="Nueva contraseña">
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            placeholder="Introduce tu nueva contraseña"
                        />
                    </Form.Item>
                    <Form.Item name="new_password2"
                               label="Confirmar contraseña"
                               rules={[{
                                   required: true, message: "Por favor confirma tu contraseña!",
                               }, ({getFieldValue}) => ({
                                   validator(rule, value) {
                                       if (!value || getFieldValue("new_password1") === value) {
                                           return Promise.resolve();
                                       }

                                       return Promise.reject("Las contraseñas no coinciden!");
                                   },
                               }),]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            placeholder="Confirma tu nueva contraseña"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
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
        selectPaswordReset: (args) => auth.endpoints.passwordReset.select(args)(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPasswordReset: (args) => {
            dispatch(auth.endpoints.passwordReset.initiate(args))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordResetConfirm));