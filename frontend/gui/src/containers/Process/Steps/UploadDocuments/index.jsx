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
} from "@ant-design/icons";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/process";
import DocumentsTable from "./DocumentsTable";

class UploadDocuments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChange: false,
		};
	}

	componentDidMount() {
		/*reference to table documents*/
		this.uploading = React.createRef();
		/* get documents details */
		this.props.getDocumentsDetails();
		console.log(this.uploading);
	}

	componentDidUpdate() {
		// charge the new state of upload to child table
		if (this.props.upload.loading !== true) {
			if (this.props.upload.payload !== null) {
				const data = this.props.upload.payload;
				if (this.uploading.current !== null) {
					console.log(this.uploading.current.state);

					this.uploading.current.onUploadSuccess(
						data.data.key,
						data.data.status
					);
				}
			}
		}
	}

	onUploadDocuments = () => {
		// send new files to user documents database
		var data = this.uploading.current.onUpload();
		var metadata = data[0];
		var file = data[1];
		//console.log(documents);
		for (const key in metadata) {
			var dataFile = metadata[key];
			// make actions
			if (dataFile.status === "uploading") {
				// upload new file into database
				this.props.uploadDocument(metadata[key], file[key], "upload");
			} else {
				if (dataFile.status === "removed") {
					// remove to the database
					this.props.uploadDocument(
						metadata[key],
						file[key],
						"removed"
					);
				}
			}
		}

		// set that the changes have been saved
		this.setState({
			isChange: false,
		});
	};

	// function to set in the page header if
	// the user has changes to save
	newChanges = (isChanged) => {
		if (isChanged) {
			this.setState({
				isChange: isChanged,
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
		var able = true;
		var dataSource = this.uploading.current.state.dataSource;
		var fileList = this.uploading.current.state.fileList;

		for (const key in dataSource) {
			if (
				fileList[key].status === "empty" &&
				dataSource[key].required === true
			) {
				able = false;
				break;
			}
		}

		if (able) {
			this.props.onNextProcess("STATUS_05");
		} else {
			this.openNotification(
				"Para avanzar termine de subir toda su documentación",
				"Error"
			);
			console.log("no puede avanzar");
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
							Guardar <SaveOutlined />
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
							correspondientes los documentos escaneados en
							<b>&nbsp;ORIGINAL&nbsp;</b> para su cotejo.
						</Descriptions.Item>
						<Descriptions.Item>
							<b>
								Un archivo digital (PDF) por cada documento, por
								ambos lados, no mayor a 2.5MB. ESCANEAR LOS
								DOCUMENTOS ORIGINALES.
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
