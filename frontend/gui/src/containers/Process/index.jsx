import React from "react";
import { Layout, Divider } from "antd";

import Sidebar from "../../components/Sidebar";
import ValidateInfo from "./Steps/ValidateInfo";
import UploadDocs from "./Steps/UploadDocs";

const { Content } = Layout;

/*Class to show graduate process ui*/
class Process extends React.Component {
	state = {
		step: 0,
	};

	getChildState = (step) => {
		this.setState({ step: step });
	};

	render() {
		return (
			<Layout
				className="site-layout-background"
				style={{ backgroundColor: "white" }}
			>
				<Sidebar
					callbackFromParent={this.getChildState}
					current={this.state.step}
				/>
				<Content
					className="site-layout-background"
					style={{
						paddingLeft: 24,
						paddingRight: 24,
						margin: 0,
						minHeight: 280,
					}}
				>
					{this.state.step === 0 ? (
						<ValidateInfo callbackFromParent={this.getChildState} />
					) : (
						<UploadDocs />
					)}
				</Content>
			</Layout>
		);
	}
}

export default Process;
