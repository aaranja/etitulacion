import React, { Component } from "react";
import { Layout } from "antd";
import GraduateTable from "../GraduateTable";
import DocumentsViewer from "../DocumentsViewer";
import SidebarList from "../../components/SidebarList";
import "antd/dist/antd.css";

class SServices extends Component {
	constructor(props) {
		super(props);

		if (props.match.params.id !== undefined) {
			this.state = {
				currentView: "documents",
				graduate: props.match.params.id,
			};
		} else {
			this.state = {
				currentView: "list",
				graduate: null,
			};
			window.history.pushState(
				"home/",
				"Home - Servicios escolares",
				`/home/`
			);
		}
	}

	setCurrentView = (view, id) => {
		if (view == "list") {
			window.history.pushState(
				"home/",
				"Home - Servicios escolares",
				`/home/`
			);
		}

		this.setState({
			currentView: view,
			graduate: id,
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
							<GraduateTable callBack={this.setCurrentView} />
						</>
					);
				case "documents":
					return (
						<>
							<DocumentsViewer
								callBack={this.setCurrentView}
								graduatePK={this.state.graduate}
							/>
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
					display: "flex",
					height: "100%",
					marginLeft: "25%",
					marginRight: "10%",
					minWidth: "50%",
				}}
			>
				{currentView()}
			</Layout>
		);
	}
}

export default SServices;
