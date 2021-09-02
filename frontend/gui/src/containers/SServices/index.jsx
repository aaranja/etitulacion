import React, { Component } from "react";
import { Layout } from "antd";
import GraduateTable from "../GraduateTable";
import DocumentsViewer from "../DocumentsViewer";
import SidebarList from "../../components/SidebarList";
import SidebarDoc from "../../components/SidebarDoc";
import "antd/dist/antd.css";

class SServices extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentView: "list",
			graduate: null,
		};
	}

	setCurrentView = (view) => {
		this.setState({
			currentView: view,
			graduate: null,
		});
	};

	setGraduateDoc = (data, view) => {
		this.setState({
			currentView: view,
			graduate: data,
		});
	};

	render() {
		const currentView = () => {
			switch (this.state.currentView) {
				case "list":
					return (
						<>
							{" "}
							<SidebarList />
							<GraduateTable callBack={this.setGraduateDoc} />
						</>
					);
				case "documents":
					return (
						<>
							<SidebarDoc info={this.state.graduate} />
							<DocumentsViewer
								callBack={this.setCurrentView}
								graduate={this.state.graduate}
							/>{" "}
						</>
					);
				default:
					return null;
			}
		};

		return (
			<Layout
				className="site-layout-background"
				style={{
					height: "100%",
					marginLeft: 425,
					marginRight: "10%",
					minWidth: 500,
				}}
			>
				{currentView()}
			</Layout>
		);
	}
}

export default SServices;
