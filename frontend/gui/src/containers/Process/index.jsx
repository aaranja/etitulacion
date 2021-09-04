import React from "react";
import { Layout, Card } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ValidateInformation from "./Steps/ValidateInformation";
import UploadDocuments from "./Steps/UploadDocuments";
import ServiceApproval from "./Steps/ServiceApproval";
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
				case 2:
					return (
						<ServiceApproval
							callbackFromParent={this.getChildState}
							status={{
								codeStatus: this.props.codeStatus,
								statusType: this.props.statusType,
								message: this.props.message,
							}}
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
					height: "100%",
					marginLeft: 300,
				}}
			>
				<Sidebar
					callbackFromParent={this.getChildState}
					current={this.state.step}
					currentFinished={this.props.currentStatus}
					style={{
						width: 400,
					}}
				/>

				<Card
					style={{
						width: "84vw",
						overflow: "initial",
					}}
				>
					<Content
						className="site-layout-background"
						style={{
							margin: 0,
							minHeight: 280,
							overflow: "initial",
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
	var keyStatus = 0;
	var codeStatus = null;
	var statustype = null;
	var message = null;
	if (state.account.payload !== null) {
		var status = currentStep(state.account.payload.status);
		keyStatus = status.key;
		codeStatus = status.code;
		statustype = status.status;
		message = status.message;
	}
	return {
		currentStatus: keyStatus,
		codeStatus: codeStatus,
		statusType: statustype,
		message: message,
	};
};

export default withRouter(connect(mapStateToProps, null)(Process));
