import React, { Component } from "react";
import { Divider, Input, Card } from "antd";
const { Search } = Input;

class SiderbarList extends Component {
	render() {
		return (
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
				<Divider orientation="left">Buscar egresado</Divider>
				<Search placeholder="Introduce nombre o matrícula" />
				<Divider orientation="left"></Divider>
			</Card>
		);
	}
}

export default SiderbarList;
