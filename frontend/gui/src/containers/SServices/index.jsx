import React, { Component } from "react";
import { Menu, Layout, Card, Input, Divider, PageHeader, Button } from "antd";
import GraduateTable from "../GraduateTable";
import "antd/dist/antd.css";
import { ReloadOutlined } from "@ant-design/icons";
const { SubMenu } = Menu;
const { Search } = Input;
class SServices extends Component {
	render() {
		return (
			<div style={{}}>
				<Layout
					className="site-layout-background"
					style={{
						backgroundColor: "green",
						height: "89vh",
						marginLeft: 425,
						marginRight: "10%",
						minWidth: 500,
					}}
				>
					<Card
						style={{
							overflow: "auto",
							position: "fixed",
							display: "flex",
							flexDirection: "column",
							minWidth: 250,
							width: 260,
							minHeight: "89vh",
							left: 170,
							padding: 0,
							backgroundColor: "white",
						}}
					>
						{" "}
						<Divider orientation="left">Buscar egresado</Divider>
						<Search placeholder="Introduce nombre o matrícula" />
						<Divider orientation="left"></Divider>
						<Menu
							defaultSelectedKeys={["1"]}
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-end",
								margin: 0,
								padding: 0,
							}}
						>
							<Menu.Item key="1">Lista de egresados</Menu.Item>
							<SubMenu title="SubMenu" key="sub1">
								<Menu.Item key="2">SubMenuItem</Menu.Item>
							</SubMenu>
						</Menu>
					</Card>
					<Card
						style={{
							margin: 0,
							minHeight: 280,
							overflow: "initial",
							height: "100%",
						}}
					>
						{" "}
						<PageHeader
							ghost={false}
							title="Lista de egresados"
							/*subTitle="This is a subtitle"*/
							extra={[
								<Button key="1">
									Actualizar <ReloadOutlined />
								</Button>,
							]}
						></PageHeader>
						<GraduateTable />
					</Card>
				</Layout>
			</div>
		);
	}
}

export default SServices;
