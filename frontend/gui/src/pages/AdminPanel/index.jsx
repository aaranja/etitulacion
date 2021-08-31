import React, { Component } from "react";
import { Menu, Layout } from "antd";
import {
	MailOutlined,
	CalendarOutlined,
	AppstoreOutlined,
} from "@ant-design/icons";
import StaffRegister from "../../containers/StaffRegister";
import SystemInformation from "../../containers/SystemInformation";
const { SubMenu } = Menu;
const { Content } = Layout;

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
		const getCurrentView = () => {
			switch (this.state.currentView) {
				case 1:
					return <SystemInformation />;

				case 3:
					return <StaffRegister />;
				default:
					return null;
			}
		};

		return (
			<div
				style={{
					marginLeft: "10vw",
					marginRight: "10vw",

					height: "70vh",
					display: "flex",
				}}
			>
				<Menu
					style={{ width: 256, height: "70vh" }}
					defaultSelectedKeys={["1"]}
					defaultOpenKeys={["sub1"]}
					mode="inline"
					theme="light"
				>
					<Menu.Item
						key="1"
						icon={<MailOutlined />}
						onClick={() => {
							this.setNewCurrentView(1);
						}}
					>
						Información del sistema
					</Menu.Item>
					<Menu.Item key="2" icon={<CalendarOutlined />}>
						Configuración
					</Menu.Item>
					<SubMenu
						key="sub1"
						icon={<AppstoreOutlined />}
						title="Cuentas"
					>
						<Menu.Item
							key="3"
							onClick={() => {
								this.setNewCurrentView(3);
							}}
						>
							Registro Staff
						</Menu.Item>
						<Menu.Item key="4">Registro egresado</Menu.Item>
					</SubMenu>
				</Menu>

				<Content
					style={{
						backgroundColor: "white",
						marginLeft: "10px",
						width: "70vw",
					}}
				>
					{getCurrentView()}
				</Content>
			</div>
		);
	}
}

export default AdminPanel;
