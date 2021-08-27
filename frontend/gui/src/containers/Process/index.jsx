import React from "react";
import { Layout, Card } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ValidateInformation from "./Steps/ValidateInformation";
import UploadDocuments from "./Steps/UploadDocuments";
import currentStep from "./utils";

const { Content } = Layout;

/*Class to show graduate process ui*/
class Process extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: this.props.currentStatus,
		};
	}

	getChildState = (step) => {
		this.setState({ step: step });
	};

	render() {
		const currentView = (step) => {
			switch (step) {
				case 1:
					return (
						<UploadDocuments
							callbackFromParent={this.getChildState}
						/>
					);
				default:
					return (
						<ValidateInformation
							callbackFromParent={this.getChildState}
						/>
					);
			}
		};

		return (
			<Layout
				className="site-layout-background"
				style={{
					width: "100%",
					height: "100%",
				}}
			>
				<Card
					style={{
						marginRight: "0.5%",
					}}
				>
					<Sidebar
						callbackFromParent={this.getChildState}
						current={this.state.step}
						style={{
							width: 400,
						}}
					/>
				</Card>
				<Card style={{ width: "100vw" }}>
					<Content
						className="site-layout-background"
						style={{
							paddingLeft: 24,
							paddingRight: 24,
							margin: 0,
							minHeight: 280,
						}}
					>
						{currentView(this.state.step)}
					</Content>
				</Card>
			</Layout>
		);
	}
}

const mapStateToProps = (state) => {
	/*load current status and set the step*/
	var status = 0;
	if (state.account.payload !== null) {
		status = currentStep(state.account.payload.status);
	}
	return {
		currentStatus: status,
	};
};

export default withRouter(connect(mapStateToProps, null)(Process));
