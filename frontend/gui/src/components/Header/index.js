import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class NormalHeader extends React.Component {
	unLogged = () => {
		return (
			<Menu
				theme="dark"
				style={{ float: "right" }}
				mode="horizontal"
				className="rightMenu"
				key="1"
			>
				<Menu.Item key="1">
					<Link to="/signup/">Registro</Link>
				</Menu.Item>
				<Menu.Item key="2">
					<Link to="/login/">Iniciar sesión</Link>
				</Menu.Item>
			</Menu>
		);
	};
	render() {
		const usermenu = () => {
			return (
				<SubMenu
					key="2"
					style={{
						justifyContent: "center",
						width: 160,
					}}
					title={
						<span>
							<UserOutlined /> &nbsp;
							{this.props.user_name}
						</span>
					}
				>
					<Menu.Item key="3" onClick={this.props.logout}>
						<LogoutOutlined />
						&nbsp; Cerrar sesión
					</Menu.Item>
				</SubMenu>
			);
		};

		return (
			<>
				{this.props.authenticated ? (
					<Header
						style={{
							height: "60px",
							position: "fixed",
							width: "100%",
							overflow: "hidden",
						}}
					>
						<div className="logo" style={{ marginLeft: 170 }}>
							<a href="/home/">
								<span style={{ color: "#FF6363" }}>e</span>
								Titulación
							</a>
						</div>
						<Menu
							theme="dark"
							mode="horizontal"
							className="rightMenu"
							key="10"
							defaultSelectedKeys={["1"]}
							style={{
								float: "right",
								marginRight: "10%",
								display: "flex",
								maxWidth: 500,
							}}
						>
							{this.props.user_type === "USER_SERVICES" ? (
								<>
									<Menu.Item key="1">
										Lista de egresados
									</Menu.Item>
									{usermenu()}
								</>
							) : (
								<>{usermenu()}</>
							)}
						</Menu>
					</Header>
				) : null}
			</>
		);
	}
}

export default NormalHeader;
