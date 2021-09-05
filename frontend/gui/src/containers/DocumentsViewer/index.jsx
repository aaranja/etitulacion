import React, { Component } from "react";
import { Card, PageHeader, Button, List, Space, Table } from "antd";
import { LoadingOutlined, DownloadOutlined } from "@ant-design/icons";
import SidebarDoc from "../../components/SidebarDoc";
import * as actions from "../../store/actions/staff_services";
import { connect } from "react-redux";

class DocumentsViewer extends Component {
	constructor(props) {
		super(props);
		console.log(props);
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

	componentWillUnmount() {
		this.props.reset("graduate");
	}

	setApproval = (message, status) => {
		this.props.setApproval(this.props.graduatePK, message, status);
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
						<>
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
										},
									};
								}}
							/>
						</>
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

	if (currentState.payload !== null) {
		// get documents name
		if (currentState.payload.documents !== undefined) {
			documents = formatDataSource(currentState.payload.documents);
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
