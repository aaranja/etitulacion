import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Layout, Menu } from "antd";
import {
	MailOutlined,
	CalendarOutlined,
	UserOutlined,
	LaptopOutlined,
	NotificationOutlined,
} from "@ant-design/icons";
import Process from "../../containers/Process";

const { Content, Sider } = Layout;

/* Class to manage all diferents views to differents users*/
class Home extends React.Component {
	constructor(props) {
		super(props);
		if (localStorage.getItem("token") === null) {
			this.props.history.push("/login/");
		}
	}
	render() {
		return <Process />;
	}
}

export default Home;
