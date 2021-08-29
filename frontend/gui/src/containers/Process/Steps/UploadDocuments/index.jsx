import React, { Component } from "react";
import { Divider, Button, PageHeader, Descriptions } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/process";
import DocumentsTable from "./DocumentsTable";

class UploadDocuments extends Component {
	componentDidMount() {
		/*reference to table documents*/
		this.uploading = React.createRef();
		/* get documents details */
		this.props.getDocumentsDetails();
	}

	componentDidUpdate() {
		// charge the new state of upload to child table
		if (this.props.upload.loading !== true) {
			if (this.props.upload.payload !== null) {
				const data = this.props.upload.payload;
				this.uploading.current.onUploadSuccess(
					data.data.key,
					data.data.status
				);
			}
		}

		if (!this.props.loading) {
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
					// console.log(metadata[key]);
					// console.log(file[key]);
				}
			}
		}
		// this.props.uploadDocument(documents);
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
						<Button
							key="2"
							onClick={() => this.onUploadDocuments()}
						>
							Guardar <SaveOutlined />
						</Button>,
						<Button key="1" type="primary">
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
				<DocumentsTable
					dataSource={this.props.dataSource}
					ref={this.uploading}
				/>
			</div>
		);
	}
}

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

const mapStateToProps = (state) => {
	var dataSource = [];
	var metadata = null;
	if (state.servdata.loading !== true && state.servdata.payload !== null) {
		metadata = state.servdata.payload;
		console.log(metadata);
		for (const key in metadata) {
			dataSource.push(metadata[key]);
		}
		if (state.account.loading !== true && state.account.payload !== null) {
			var userDoc = state.account.payload.documents;

			for (const newkey in userDoc) {
				var docKey = userDoc[newkey].key;

				dataSource[docKey] = tableMetadata(
					metadata[docKey],
					userDoc[newkey]
				);
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
		uploadDocuments: (values) => dispatch(actions.processStep2(values)),
		uploadDocument: (metadata, file, update_type) =>
			dispatch(
				actions.processUploadDocument(metadata, file, update_type)
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadDocuments);
