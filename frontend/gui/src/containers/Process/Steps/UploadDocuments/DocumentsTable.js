import React, { Component } from "react";
import {
	UploadOutlined,
	CheckCircleOutlined,
	ExclamationCircleOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { Upload, Button, message, Tag, Table } from "antd";

class DocumentsTable extends Component {
	constructor(props) {
		super(props);
		/*set all files to state */
		var docList = {};
		var preFiles = {};
		for (const key in this.props.dataSource) {
			docList[key] = this.getFileList(this.props.dataSource[key]);
			preFiles[key] = null;
		}
		this.state = {
			dataSource: this.props.dataSource,
			fileList: docList,
			uploading: false,
			files: preFiles,
			newChanges: false,
		};
	}

	/*convert a file into a unique file list*/
	getFileList = (record) => {
		if (record !== undefined) {
			var status = record.status === "uploaded" ? "success" : "empty";

			var fileName = record.fileName === undefined ? "" : record.fileName;
			var url = record.url === undefined ? "" : record.url;

			return {
				uid: "-1",
				name: fileName,
				status: status,
				url: url,
			};
		}
		return {};
	};

	// called from parent to set the new status from sever side
	onUploadSuccess = (key, status) => {
		var currentDataSource = this.state.dataSource;
		var currentFileList = this.state.fileList;

		if (status === "success") {
			currentDataSource[key].status = "uploaded";
			currentFileList[key].status = "success";
			this.setState({
				dataSource: currentDataSource,
				fileList: currentFileList,
			});
		} else {
			if (status === "removed") {
				currentFileList[key].status = "empty";
				console.log(currentFileList);
				message.error(`Se eliminó: ${currentDataSource[key].fullName}`);
				this.setState({
					fileList: currentFileList,
				});
			}
		}
	};

	onUpload = () => {
		var currentList = this.state.fileList;
		var currentDataSource = this.state.dataSource;
		var uploadList = {};
		// leer en los datos de la tabla

		for (const key in currentDataSource) {
			// utilizando el key del dataSource, obtenemos el documento correcto
			// iniciamos la preparación de carga de los campos en proceso
			if (
				currentList[key].status === "processing" ||
				currentList[key].status === "success" ||
				currentList[key].status === "removed"
			) {
				// conseguimos la referencia del documento concreto
				var currentDoc = currentList[key];
				var dataDoc = currentDataSource[key];
				var status =
					currentDoc.status === "processing"
						? "uploading"
						: currentDoc.status === "success"
						? "uploaded"
						: "removed";
				// se crea los datos a subir en la bd de user documents
				uploadList[key] = {
					key: key,
					keyName: dataDoc.keyName,
					fileName: currentDoc.name,
					status: status,
					url: `www.etitulacion.com/documentos/egresado/${dataDoc.keyName}`,
				};
				if (currentDoc.status === "processing") {
					// se cambia el estado a cargando del documento
					dataDoc.status = "loading";
					// el documento cambiado se agregado al datasource
					// para que el estado del documento se actualice
					currentDataSource[key] = dataDoc;
				}
			}
		}

		// provocamos el cambio de estado
		this.setState({
			dataSource: currentDataSource,
			fileList: currentList,
			uploading: true,
			newChanges: false,
		});

		return [uploadList, this.state.files];
	};

	render() {
		const datacolumns = [
			{
				title: "Documento",
				dataIndex: "fullName",
				width: "20%",
			},
			{
				title: "Descripción",
				dataIndex: "description",
				width: "40%",
				render: (text, record) => {
					return text;
				},
			},
			{
				title: "Estatus",
				dataIndex: "status",
				width: "10%",
				render: (text, record) => {
					if (text === "uploaded") {
						return (
							<Tag
								icon={<CheckCircleOutlined />}
								color="success"
								style={{ width: "100%" }}
							>
								Cargado
							</Tag>
						);
					} else {
						if (text === "loading") {
							return (
								<Tag
									icon={<SyncOutlined spin />}
									color="processing"
									style={{ width: "100%" }}
								>
									Subiendo
								</Tag>
							);
						}
					}

					return (
						<Tag
							icon={<ExclamationCircleOutlined />}
							color="default"
							style={{ width: "100%" }}
						>
							Sin cargar
						</Tag>
					);
				},
			},
			{
				title: "Archivo",
				dataIndex: "archivo",
				render: (text, record) => {
					const uploadProps = {
						onRemove: (info, key = record.key) => {
							var dataFiles = this.state.fileList;
							var dataTable = this.state.dataSource;
							var files = this.state.files;
							dataFiles[key - 1].status = "removed";
							dataFiles[key - 1].name = "";
							dataTable[key - 1].fileName = "";
							dataTable[key - 1].status = "removed";
							files[key - 1] = null;
							this.setState({
								dataSource: dataTable,
								fileList: dataFiles,
								files: files,
							});

							this.props.callBack(true);
						},
						maxCount: 1,

						beforeUpload: (file) => {
							if (file.type !== "application/pdf") {
								message.error(
									`${file.name} no es un archivo PDF!`
								);
							}
							return false;
							/*return file.type === "pdf"
								? true
								: Upload.LIST_IGNORE;*/
						},
						onChange: (info, key = record.key) => {
							var dataFiles = this.state.fileList;
							var newFile = info.fileList[0];
							var dataTable = this.state.dataSource;
							var files = this.state.files;

							/* only update fileList if the new document is a PDF*/
							if (info.fileList.length === 1) {
								// length === 1 is new file
								if (newFile.type === "application/pdf") {
									var index = key - 1;
									dataFiles[index] = info.fileList[0];
									dataFiles[index].status = "processing";
									dataTable[index].fileName =
										info.fileList[0].name;

									dataTable[index].status = "unloaded";
									files[index] = info.file;
									this.setState({
										dataSource: dataTable,
										fileList: dataFiles,
										files: files,
									});
									this.props.callBack(true);
								}
							}
						},
						multiple: false,
					};

					var uploadButton = (
						<Button>
							<UploadOutlined /> Elegir archivo
						</Button>
					);

					var fileList;
					var file = this.state.fileList[record.key - 1];

					fileList = [file];
					if (
						file.status === "success" ||
						file.status === "processing"
					) {
						uploadButton = null;
					} else {
						fileList = null;
					}

					return (
						<Upload
							{...uploadProps}
							fileList={fileList}
							showUploadList={{
								showRemoveIcon: true,
							}}
						>
							{uploadButton}
						</Upload>
					);
				},
			},
		];

		const columns = datacolumns.map((col) => {
			return col;
		});

		return (
			<Table
				pagination={false}
				rowClassName={() => "editable-row"}
				bordered
				dataSource={this.state.dataSource}
				columns={columns}
				style={{ fontSize: "110%" }}
			/>
		);
	}
}

export default DocumentsTable;
