import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
	UserOutlined,
	ProfileOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class NormalHeader extends React.Component {
	render() {
		return (
			<Header
				style={{
					height: "60px",
					position: "fixed",
					width: "100%",
					overflow: "hidden",
				}}
			>
				<div className="logo">
					<a href="/home/">
						<span style={{ color: "#FF6363" }}>e</span>Titulación
					</a>
				</div>
				<Menu theme="dark" mode="horizontal" className="rightMenu">
					{this.props.authenticated ? (
						<SubMenu
							style={{ float: "right" }}
							key="1"
							title={
								<span>
									<UserOutlined />
									{this.props.user_name}
								</span>
							}
						>
							<Menu.Item key="setting:1">
								<span>
									<ProfileOutlined />
									<Link to="/account/">Datos personales</Link>
								</span>
							</Menu.Item>
							<Menu.Item
								key="setting:2"
								onClick={this.props.logout}
							>
								<span>
									<LogoutOutlined />
									Cerrar sesión
								</span>
							</Menu.Item>
						</SubMenu>
					) : (
						<Menu
							theme="dark"
							style={{ float: "right" }}
							mode="horizontal"
							className="rightMenu"
						>
							<Menu.Item key="1">
								<Link to="/signup/">Registro</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/login/">Iniciar sesión</Link>
							</Menu.Item>
						</Menu>
					)}
				</Menu>
			</Header>
		);
	}
}

export default NormalHeader;
