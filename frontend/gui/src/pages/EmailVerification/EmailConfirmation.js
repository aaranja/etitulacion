import React, {Component} from "react";
import {connect} from "react-redux";
import {auth} from "../../store/services/auth";
import {Button, Card, Divider, Form, Space, Typography} from "antd";
import {MailTwoTone, SmileTwoTone, SendOutlined} from "@ant-design/icons";
import ReactCodeInput from "react-code-input";
import moment from "moment";
import NTimer from "./NTimer";

const {Title, Paragraph, Text} = Typography

class EmailConfirmation extends Component {

    constructor(props) {
        super(props);

        this.form = React.createRef();

        let dateObj = new Date(this.props.time);
        let travelTime = moment(dateObj).add(15, 'minutes')

        let now = moment(new Date())
        let duration = moment.duration(travelTime.diff(now));
        let minutes = duration.asMinutes();
        this.state = {
            code: "", data: null, minutes: minutes, enableResend: false,
        };
    }

    onFinish = (values) => {
        const data = {code: values.code, email: this.props.email};
        this.setState({
            data: data,
        });
        this.props.sendCode(data);
    };

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        let result = this.props.confirmation(this.state.data)
        if (result.isError) {
            this.setFormErrors(result.error.data)
        }
    }

    enableResend = (arg) => {
        this.setState({
            enableResend: arg,
        })
    }

    render() {
        let result = this.props.confirmation(this.state.data)

        console.log(result)
        return (<Card style={{textAlign: "center"}}>
                {!result.isSuccess ? (<>
                        <Title>Completar registro en ETITULACIÓN</Title>
                        <MailTwoTone style={{fontSize: 60, marginBottom: "20px"}}/>
                        <Paragraph>
                            Se ha enviado por correo electrónico a{" "}
                            <Text underline>{this.props.email}</Text> el código para confirmar su
                            registro.
                        </Paragraph>
                        <Paragraph>
                            Para continuar, introduzca el código de confirmación de 6 dígitos
                            en el siguiente campo:
                        </Paragraph>
                        <div
                            style={{
                                alignItems: "center", display: "flex", flexDirection: "column",
                            }}
                        >
                            <Form
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                ref={this.form}
                                layout="vertical"
                                onFinish={this.onFinish}
                            >
                                <Form.Item
                                    label="Código: "
                                    name="code"
                                    extra={[

                                        <NTimer key={2} duration={this.state.minutes}
                                                onComplete={this.enableResend}/>,]}
                                >
                                    <ReactCodeInput
                                        onChange={(value) => {
                                            if (value.length >= 6) {
                                                this.setState({enableConfirm: true});
                                            } else {
                                                if (this.state.enableConfirm) {
                                                    this.setState({enableConfirm: false});
                                                }
                                            }
                                        }}
                                        initialFocus={true}
                                        type="number"
                                        fields={6}
                                        inputMode="numeric"
                                        name="code-verification"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Space>
                                        <Button
                                            disabled={!this.state.enableConfirm}
                                            type="primary"
                                            loading={result.isLoading}
                                            htmlType="submit"

                                        >
                                            Confirmar
                                        </Button>
                                        <Button type="link" disabled={!this.state.enableResend} icon={<SendOutlined/>}>Enviar
                                            nuevo correo </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </>) : (<>
                        <Title>Verificación de cuenta exitosa</Title>
                        <SmileTwoTone style={{fontSize: 60, marginBottom: "20px"}}/>
                        <Paragraph>
                            En unos momentos se te
                            redirigirá a la pagina de inicio.
                        </Paragraph>
                        <Divider/>
                    </>)}
            </Card>);
    }
}

const mapStateToProps = (state) => {
    return {
        confirmation: (data) => auth.endpoints.sendConfirmation.select(data)(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendCode: (data) => {
            dispatch(auth.endpoints.sendConfirmation.initiate(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfirmation);