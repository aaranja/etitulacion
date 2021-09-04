import React, { Component } from "react";
import { Card, PageHeader, Button, List, Space } from "antd";
import { LoadingOutlined, DownloadOutlined } from "@ant-design/icons";
import SidebarDoc from "../../components/SidebarDoc";
import * as actions from "../../store/actions/staff_services";
import { connect } from "react-redux";

class DocumentsViewer extends Component {
	constructor(props) {
		super(props);

		// get the name of the documents
		this.props.getDocumentsDetails();

		//get info and documents uploaded with enrollment
		window.history.pushState(
			"documents/",
			"Documentación",
			`/home/documents/${props.graduatePK}/`
		);

		this.props.getGraduateData(props.graduatePK);
	}

	setApproval = (message, status) => {
		this.props.setApproval(this.props.graduatePK, message, status);
	};

	componentDidUpdate() {}

	render() {
		return (
			<>
				<SidebarDoc
					graduate={this.props.graduateData}
					onApproval={this.setApproval}
				/>
				<Card
					style={{
						margin: 0,
						minHeight: 280,
						overflow: "initial",
					}}
				>
					<PageHeader
						ghost={false}
						title="Documentos"
						onBack={() => {
							this.props.callBack("list", null);
						}}
						/*subTitle="This is a subtitle"*/
					></PageHeader>
					{this.props.loading ? (
						<LoadingOutlined />
					) : this.props.error !== "NO_DOCUMENTS" ? (
						<List
							size="middle"
							loading={this.props.loading}
							footer={
								<div
									style={{
										display: "flex",
										justifyContent: "center",
									}}
								>
									<Space>
										Descargar todos los archivos
										<Button type="primary">
											<DownloadOutlined /> Aquí
										</Button>
									</Space>
								</div>
							}
							bordered
							dataSource={this.props.metadata}
							renderItem={(item) => (
								<div
									key={item.key}
									onClick={(key) => {
										console.log(key);
									}}
								>
									<List.Item
										actions={[
											// eslint-disable-next-line
											<a key="list-loadmore-edit">
												<DownloadOutlined /> &nbsp;
												Descargar
											</a>,
										]}
									>
										{item}
									</List.Item>
								</div>
							)}
						/>
					) : (
						<p>
							El egresado {this.props.graduatePK} no ha cargado
							documentos
						</p>
					)}
				</Card>
			</>
		);
	}
}

const formatDataSource = (metadata) => {
	var list = [];
	if (metadata !== undefined) {
		for (const key in metadata) {
			if (metadata[key].clasification !== 2) {
				list.push(metadata[key].fullName);
			}
		}
	}
	return list;
};

const mapStateToProps = (state) => {
	var documents = [];
	var graduateData = null;
	var error = null;
	// var loading = true;

	var currentState = state.staff_services;
	if (!currentState.loading && currentState.payload !== null) {
		// get documents name
		if (currentState.payload.documents !== undefined) {
			documents = formatDataSource(currentState.payload.documents);
		}

		// get graduate data
		if (currentState.payload.graduate !== undefined) {
			graduateData = currentState.payload.graduate;
			// loading = false;
			if (
				graduateData.status === "STATUS_01" ||
				graduateData.status === "STATUS_00"
			) {
				error = "NO_DOCUMENTS";
			}
		}
	}

	return {
		loading: state.staff_services.loading,
		metadata: documents,
		graduateData: graduateData,
		error: error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getDocumentsDetails: () => dispatch(actions.getDocumentsDetails()),
		getGraduateData: (enrollment) =>
			dispatch(actions.getGraduate(enrollment)),
		setApproval: (enrollment, message, type) =>
			dispatch(actions.setApproval(enrollment, message, type)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsViewer);
