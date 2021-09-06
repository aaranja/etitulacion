import React, { Component } from "react";
import { Card, PageHeader, Button, List, Space, Table } from "antd";
import { LoadingOutlined, DownloadOutlined } from "@ant-design/icons";
import SidebarDoc from "../../components/SidebarDoc";
import * as actions from "../../store/actions/staff_services";
import { connect } from "react-redux";
import DocumentPDF from "./DocumentPDF";

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

		this.state = {
			currentView: "table",
			title: null,
		};
	}

	componentWillUnmount() {
		this.props.reset("graduate");
	}

	setApproval = (message, status) => {
		this.props.setApproval(this.props.graduatePK, message, status);
	};

	setCurrentView = (view, title) => {
		if (view === "table") {
			this.props.reset("document");
		}

		this.setState({
			currentView: view,
			title: title,
		});
	};

	render() {
		const columns = [
			{
				title: "No.",
				dataIndex: "key",
				key: "key",
				width: "5%",
			},

			{
				title: "Nombre del archivo",
				dataIndex: "fullName",
				key: "fullName",
			},
			{
				title: "Operación",
				dataIndex: "download",
				width: "10%",
				key: "download",
				render: (key, record) => {
					return (
						<Button
							icon={<DownloadOutlined />}
							shape="round"
							type="dashed"
						>
							Descargar
						</Button>
					);
				},
			},
		];

		const view = () => {
			if (this.state.currentView === "table") {
				if (this.props.error !== "NO_DOCUMENTS") {
					return (
						<>
							<PageHeader
								ghost={false}
								title="Documents"
								onBack={() => {
									this.props.callBack("list", null);
								}}
								/*subTitle="This is a subtitle"*/
							></PageHeader>
							<Table
								columns={columns}
								dataSource={this.props.metadata}
								pagination={false}
								bordered
								onRow={(record, rowIndex) => {
									return {
										onClick: (event) => {
											this.props.getDocument(
												this.props.graduatePK,
												record.download
											);

											this.setCurrentView(
												"documentPDF",
												record.fullName
											);
										},
									};
								}}
							/>
						</>
					);
				} else {
					return (
						<p>
							El egresado {this.props.graduatePK} no ha cargado
							documentos
						</p>
					);
				}
			} else {
				if (this.state.currentView === "documentPDF") {
					return (
						<DocumentPDF
							callBack={this.setCurrentView}
							title={this.state.title}
							document={this.props.viewDocument}
						/>
					);
				}
			}
		};

		return (
			<>
				<SidebarDoc
					graduate={this.props.graduateData}
					loading={this.props.loading}
					onApproval={this.setApproval}
				/>

				<Card
					style={{
						margin: 0,
						minHeight: 280,
						overflow: "initial",
						marginRight: 150,
					}}
				>
					{this.props.loading ? <LoadingOutlined /> : view()}
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
				list.push({
					key: key,
					fullName: metadata[key].fullName,
					download: metadata[key].keyName,
				});
			}
		}
	}
	return list;
};

const mapStateToProps = (state) => {
	var documents = [];
	var graduateData = null;
	var error = null;
	var loading = true;
	var currentState = state.staff_services;
	var viewDocument = null;

	// console.log(state);

	if (currentState.payload !== null) {
		// get documents name
		if (currentState.payload.documents !== undefined) {
			documents = formatDataSource(currentState.payload.documents);
		}

		if (currentState.payload.document !== undefined) {
			if (currentState.payload.document !== null) {
				viewDocument = currentState.payload.document;
			}
		}

		// get graduate data
		if (
			currentState.payload.graduate !== undefined &&
			currentState.payload.graduate !== null
		) {
			graduateData = currentState.payload.graduate;
			loading = false;
			if (
				graduateData.status === "STATUS_01" ||
				graduateData.status === "STATUS_00"
			) {
				error = "NO_DOCUMENTS";
			}
		}
	}

	return {
		loading: loading,
		metadata: documents,
		graduateData: graduateData,
		error: error,
		viewDocument: viewDocument,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getDocumentsDetails: () => dispatch(actions.getDocumentsDetails()),
		getGraduateData: (enrollment) =>
			dispatch(actions.getGraduate(enrollment)),
		setApproval: (enrollment, message, type) =>
			dispatch(actions.setApproval(enrollment, message, type)),
		reset: (type) => dispatch(actions.resetData(type)),
		getDocument: (enrollment, keyName) => {
			dispatch(actions.getDocument(enrollment, keyName));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsViewer);
