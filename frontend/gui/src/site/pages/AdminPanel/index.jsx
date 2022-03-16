import React, {Component} from "react";
import {Layout, Menu} from "antd";
import {
    AppstoreOutlined,
    CalendarOutlined,
    MailOutlined,
} from "@ant-design/icons";
import SystemInformation from "../../../containers/Admin/SiteInformation";
import Accounts from "../../../containers/Admin/Accounts";

const {SubMenu} = Menu;
const {Content} = Layout;

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: 1,
        };
    }

    setNewCurrentView = (key) => {
        this.setState({
            currentView: key,
        });
    };

    render() {
        const getCurrentView = (key) => {
            switch (key) {
                case 1:
                    return <SystemInformation/>;
                case 2:
                    return <Accounts key="services" type="services"/>;
                case 3:
                    return <Accounts key="coordination" type="coordination"/>;
                default:
                    return null;
            }
        };

        return (
            <div
                style={{
                    marginTop: "5vh",
                    display: "flex",
                }}
            >
                <Menu
                    style={{width: 256, height: "70vh"}}
                    defaultSelectedKeys={["3"]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    theme="light"
                >
                    {/*<Menu.Item*/}
                    {/*  key="1"*/}
                    {/*  icon={<MailOutlined />}*/}
                    {/*  onClick={() => {*/}
                    {/*    this.setNewCurrentView(1);*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  Información del sistema*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="2" icon={<CalendarOutlined />}>*/}
                    {/*  Configuración*/}
                    {/*</Menu.Item>*/}
                    <SubMenu key="sub1" icon={<AppstoreOutlined/>} title="Cuentas">
                        <Menu.Item
                            key="3"
                            onClick={() => {
                                this.setNewCurrentView(2);
                            }}
                        >
                            Servicios Escolares
                        </Menu.Item>
                        <Menu.Item
                            key="4"
                            onClick={() => {
                                this.setNewCurrentView(3);
                            }}
                        >
                            Coordinación de Titulación
                        </Menu.Item>
                        <Menu.Item key="5">Egresados</Menu.Item>
                    </SubMenu>
                </Menu>

                <Content
                    style={{
                        backgroundColor: "white",
                        marginLeft: "10px",
                        width: "70vw",
                    }}
                >
                    {getCurrentView(this.state.currentView)}
                </Content>
            </div>
        );
    }
}

export default AdminPanel;
