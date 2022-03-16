import React from "react";
import {Menu} from "antd";
import {Link} from "react-router-dom";
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
} from "@ant-design/icons";

const SubMenu = Menu.SubMenu;

export default class UserSubMenu extends React.Component {
    render() {
        const submenu = (user_type) => {
            switch (user_type) {
                case "USER_GRADUATE":
                    return (
                        <GraduateMenu
                            key="sub9"
                            user_name={this.props.user_name}
                            logout={this.props.logout}
                        />
                    );
                case "USER_COORDINAT":
                    return (
                        <CoordinationMenu
                            key="sub9"
                            user_name={this.props.user_name}
                            logout={this.props.logout}
                        />
                    );
                case "USER_SERVICES":
                    return (
                        <ServicesMenu
                            key="sub9"
                            user_name={this.props.user_name}
                            logout={this.props.logout}
                        />
                    );
                case "USER_ADMIN":
                    return (
                        <CoordinationMenu
                            key="sub9"
                            user_name={this.props.user_name}
                            logout={this.props.logout}
                        />
                    );
                default:
                    return null;
            }
        };
        return <>{submenu(this.props.user_type)}</>;
    }
}

class ServicesMenu extends React.Component {
    render() {
        return (
            <SubMenu
                key="2"
                style={{
                    justifyContent: "center",
                    width: 160,
                }}
                title={
                    <p style={{margin: "auto", color: "white"}}>
                        <UserOutlined/> &nbsp;
                        {this.props.user_name}
                    </p>
                }
            >
                <Menu.Item key="3">
                    <Link to="/home/services/settings/">
                        <SettingOutlined/>
                        &nbsp; Configuración
                    </Link>
                </Menu.Item>
                <Menu.Item key="4" onClick={this.props.logout}>
                    <LogoutOutlined/>
                    &nbsp; Cerrar sesión
                </Menu.Item>
            </SubMenu>
        );
    }
}

class CoordinationMenu extends React.Component {
    render() {
        return (
            <SubMenu
                key="2"
                style={{
                    justifyContent: "center",
                    width: 160,
                }}
                title={
                    <p style={{margin: "auto", color: "white"}}>
                        <UserOutlined/> &nbsp;
                        {this.props.user_name}
                    </p>
                }
            >
                <Menu.Item key="3">
                    <Link to="/coordination/settings/">
                        <SettingOutlined/>
                        &nbsp; Configuración
                    </Link>
                </Menu.Item>
                <Menu.Item key="4" onClick={this.props.logout}>
                    <LogoutOutlined/>
                    &nbsp; Cerrar sesión
                </Menu.Item>
            </SubMenu>
        );
    }
}

class GraduateMenu extends React.Component {
    render() {
        return (
            <SubMenu
                key="2"
                style={{
                    justifyContent: "center",
                    width: 160,
                }}
                title={
                    <p style={{margin: "auto", color: "white"}}>
                        <UserOutlined/> &nbsp;
                        {this.props.user_name}
                    </p>
                }
            >
                <Menu.Item key="4" onClick={this.props.logout}>
                    <LogoutOutlined/>
                    &nbsp; Cerrar sesión
                </Menu.Item>
            </SubMenu>
        );
    }
}
