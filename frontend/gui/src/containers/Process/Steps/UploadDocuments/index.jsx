import React, { Component } from "react";
import {
	Divider,
	Button,
	PageHeader,
	Descriptions,
	Tag,
	notification,
} from "antd";
import {
	ArrowRightOutlined,
	SaveOutlined,
	CloseCircleOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/process";
import DocumentsTable from "./DocumentsTable";

class UploadDocuments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChange: false, // changes state tag
			typeChange: "empty", // upload status on update
			uploadList: [], // current list to upload on update
			uploadCount: 0, // lenght of the current list
			loading: false, // loading state to save icon
		};
	}

	componentDidMount() {
		// console.log("me he montado");
		/*reference to table documents*/
		this.uploading = React.createRef();
		/* get documents details */
		this.props.getDocumentsDetails();
	}

	componentDidUpdate() {
		// when the component is rachaged, verify if uploadlist is lenght 0,
		// if is not 0, remove one and then upload it
		// then, update the state to do the same until the upload list lenght
		// is 0
		if (!this.props.upload.loading) {
			// only when typeChange upload is active
			if (this.state.typeChange === "upload") {
				// set the charge is success to the current load
				const data = this.props.upload.payload;
				this.uploading.current.onUploadSuccess(
					data.data.key,
					data.data.status
				);
			}
			if (this.state.uploadCount > 0) {
				var count = this.state.uploadCount - 1;

				// get all upload list
				var uploadList = this.state.uploadList;
				// remove one document from upload list
				var uDocument = uploadList.shift();
				// upload that document remove
				this.props.uploadDocument(
					uDocument.metadata,
					uDocument.file,
					uDocument.type
				);

				// changes tag is set
				var isChange = true; // activate top changes tag
				var loading = true; // activate icon loading
				var typeChange = "upload"; // activate change tag charges in table

				// remove changes tag if count is void
				if (count === 0) {
					isChange = false; // deactivate top changes tag
					loading = false; // deactivate icon loading
				}

				this.setState({
					uploadList: uploadList,
					uploadCount: count,
					isChange: isChange,
					loading: loading,
					typeChange: typeChange,
				});
			}
		}
	}
	// send new files to uploadList state to
	// send to server when component is update
	onUploadDocuments = () => {
		// get list of documents from child
		var data = this.uploading.current.onUpload();
		var metadata = data[0];
		var file = data[1];
		var uploadCount = 0;
		var uploadList = [];

		// iterate metadata to get the correct files to save it
		for (const key in metadata) {
			var dataFile = metadata[key];
			// save the file into uploadList
			if (dataFile.status === "uploading") {
				uploadCount++;
				uploadList.push({
					metadata: metadata[key],
					file: file[key],
					type: "upload",
				});
			} else {
				if (dataFile.status === "removed") {
					uploadCount++;
					uploadList.push({
						metadata: metadata[key],
						file: file[key],
						type: "removed",
					});
				}
			}
		}

		// save upload list if has one document and change state
		if (uploadCount !== 0) {
			this.setState({
				uploadCount: uploadCount,
				uploadList: uploadList,
				loading: true,
			});
		}
	};

	// function to set in the page header if
	// the user has changes to save
	newChanges = (isChanged, type) => {
		// set changes state tags true
		// deactivate upload on update when typechange is not 'upload'
		if (isChanged) {
			this.setState({
				isChange: isChanged,
				typeChange: type,
			});
		}
	};

	openNotification = (mensaje, type) => {
		notification.open({
			message: type,
			description: mensaje,
			icon: <CloseCircleOutlined style={{ color: "#FF4848" }} />,
		});
	};

	onNextProcess = () => {
		var enable = true;
		var dataSource = this.uploading.current.state.dataSource;
		var fileList = this.uploading.current.state.fileList;

		for (const key in dataSource) {
			if (
				fileList[key].status === "empty" &&
				dataSource[key].required === true
			) {
				enable = false;
				break;
			}
		}

		if (enable) {
			this.props.onNextProcess("STATUS_05");
		} else {
			this.openNotification(
				"Para avanzar termine de subir toda su documentación",
				"Error"
			);
		}
	};

	render() {
		return (
			<div>
				<PageHeader
					ghost={false}
					onBack={() => this.props.callbackFromParent(0)}
					title="Documentación"
					/*subTitle="This is a subtitle"*/
					extra={[
						<Tag key="3" visible={this.state.isChange}>
							Tiene cambios sin guardar
						</Tag>,
						<Button
							key="2"
							onClick={() => this.onUploadDocuments()}
						>
							Guardar{" "}
							{this.state.loading ? (
								<LoadingOutlined />
							) : (
								<SaveOutlined />
							)}
						</Button>,
						<Button
							key="1"
							type="primary"
							onClick={() => this.onNextProcess()}
						>
							Siguiente <ArrowRightOutlined />
						</Button>,
					]}
				>
					<Descriptions size="middle" column={1}>
						<Descriptions.Item label={<b>INSTRUCCIONES</b>}>
							Deberá subir en cada uno de los apartos
							correspondientes los documentos
							<b>&nbsp;ESCANEADOS EN ORIGINAL&nbsp;</b> para su
							cotejo.
						</Descriptions.Item>
						<Descriptions.Item>
							<b>
								Un archivo digital (PDF) por cada documento, por
								ambos lados, no mayor a 2.5MB.
							</b>
						</Descriptions.Item>
						<Descriptions.Item>
							<b>
								Asegurese de que toda su documentación esté
								correcta, una vez que le de click al botón de
								siguiente se iniciará el proceso de revisión por
								parte de servicios escolares.
							</b>
						</Descriptions.Item>
					</Descriptions>
				</PageHeader>
				<Divider orientation="center">Subir documentación</Divider>

				{this.props.loading !== true ? (
					<DocumentsTable
						dataSource={this.props.dataSource}
						ref={this.uploading}
						callBack={this.newChanges}
					/>
				) : (
					<p>CARGANDO </p>
				)}
			</div>
		);
	}
}

// function to return a merge betweern document
// metadata and user document, to set into dataSource
const tableMetadata = (metadata, userDocument) => {
	var fileName = "";
	var status = "empty";
	var url = "";
	if (userDocument !== undefined) {
		fileName = userDocument.fileName;
		status = userDocument.status;
		url = userDocument.url;
	}
	return {
		key: metadata.key,
		keyName: metadata.keyName,
		fileName: fileName,
		fullName: metadata.fullName,
		description: metadata.description,
		status: status,
		required: metadata.required,
		url: url,
	};
};

// function to filter clasification
// between services, coordination or both
// return true if clasification is for services
const getClasification = (metadata) => {
	var clas = metadata.clasification;

	if (clas === 1 || clas === 3) {
		return true;
	}

	return false;
};

const mapStateToProps = (state) => {
	var dataSource = [];
	var metadata = null;
	// when documents data isn't loading and is in payload,
	// charge metadata files on datasource
	// to put in table
	if (state.servdata.loading !== true && state.servdata.payload !== null) {
		metadata = state.servdata.payload;

		for (const key in metadata) {
			// return true if document is services clasification
			if (getClasification(metadata[key])) {
				// put documents metadata into dataSource
				dataSource.push(metadata[key]);
			}
		}
		// when user data is loaded, put in datasource to load
		// the current state of documents
		if (state.account.loading !== true && state.account.payload !== null) {
			// metadata of user documents
			var userDoc = state.account.payload.documents;

			for (const newkey in userDoc) {
				var docKey = userDoc[newkey].key;
				// return true if document is services clasification
				if (getClasification(metadata[docKey])) {
					// put user documents metadata into dataSource
					dataSource[docKey] = tableMetadata(
						metadata[docKey],
						userDoc[newkey]
					);
				}
			}
		}
	}

	return {
		dataSource: dataSource,
		upload: state.upload,
		loading: state.servdata.loading,
		loadingAccount: state.account.loading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getDocumentsDetails: () =>
			dispatch(actions.processGetDocumentsDetails()),
		onNextProcess: (status) => dispatch(actions.processStep2(status)),
		uploadDocument: (metadata, file, update_type) =>
			dispatch(
				actions.processUploadDocument(metadata, file, update_type)
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadDocuments);
