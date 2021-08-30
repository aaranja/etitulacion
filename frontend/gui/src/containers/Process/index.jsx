import React from "react";
import { Layout, Card, Menu, Affix } from "antd";
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
		console.log(this.props);
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
				<Sidebar
					callbackFromParent={this.getChildState}
					current={this.state.step}
					name={this.props.name}
					style={{
						width: 400,
					}}
				/>

				<Card
					style={{
						width: "90vw",
						overflow: "initial",
						marginLeft: 260,
					}}
				>
					<Content
						className="site-layout-background"
						style={{
							paddingLeft: 24,
							paddingRight: 24,
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
	var name = null;
	var status = 0;
	if (state.account.payload !== null) {
		status = currentStep(state.account.payload.status);
		if (status === 5) {
			status = 2;
		}
		name =
			state.account.payload.account["first_name"] +
			" " +
			state.account.payload.account["last_name"];
	}
	return {
		currentStatus: status,
		name: name,
	};
};

export default withRouter(connect(mapStateToProps, null)(Process));
