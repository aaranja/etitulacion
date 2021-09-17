import React, { Component } from "react";
import {PageHeader, Button, Descriptions, Form, Select, Divider, Tag, notification} from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/process";
import DocumentsTable from "./DocumentsTable";
import {ArrowRightOutlined, CloseCircleOutlined, LoadingOutlined, SaveOutlined} from "@ant-design/icons";

class TypeTitulation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			typeChange: "empty",
			isChange: false,
			uploadList: [],
			uploadCount:0,
			loading: false,
			dataSource: [],
		}
	}

	componentDidMount() {
		/*reference to table documents*/
		this.documentsTable = React.createRef();
		/* get documents details */
		this.props.getDocumentsDetails();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	//	when the component is recharged, verify if uploadlist is lenght 0,
	//	if is not 0, remove one and then upload it
	//	then, update the state to do the same until the upload list length is 0
		if(!this.props.upload.loading){
			//	set the charge is success to the current load
			if(this.props.upload.error!==null){
				this.openNotification(this.props.upload.error.toString(), "Error")
			}else{
				if(this.state.typeChange === "upload"){
					const data = this.props.upload.payload.data;
					this.documentsTable.current.onUploadSuccess(
						data.key,
						data.status
					);
				}
			}
		//	upload a file if upload count is not 0
			if(this.state.uploadCount>0){
				const count = this.state.uploadCount -1;
			//	get upload list
				let uploadList = this.state.uploadList;
			//	remove one documents from upload list
				const uDocument = uploadList.shift();
			//	upload that documents removed
				console.log(uDocument)
				this.props.uploadDocument(
					uDocument.metadata, uDocument.file, uDocument.type,
				);

				let isChange = true; // activate top changes tag
				let loading = true; // activate icon loading
				const typeChange = "upload"; // activate change tag charges in table

				// remove changes tag if count is void
				if(count === 0){
					isChange = false; // deactivate top changes tag
					loading = false; // deactivate icon loading
				}

				this.setState({
					uploadList: uploadList,
					uploadCount: count,
					isChange: isChange,
					loading: loading,
					typeChange: typeChange,
				})
			}
		}
	}

	openNotification = (mensaje, type) => {
		notification.open({
			message: type,
			description: mensaje,
			icon: <CloseCircleOutlined style={{ color: "#FF4848" }} />,
		});
	};


	onFinish = (values) =>{
		console.log(values)
	}

	onSave = ()=>{
		// get data from table documents
		const data = this.documentsTable.current.onUpload();
		// metadata and files
		const metadata = data[0];
		const files = data[1];
		// create a uploadlist and count
		let uploadList = [];
		let uploadCount = 0;

		// get uploading or removing documents only
		for(const key in metadata){
			const metadataFile = metadata[key];
		//	save file into uploadlist
			if(metadataFile.status === "uploading" || metadataFile.status === "removed"){
				uploadCount++;
				uploadList.push({
					metadata:metadata[key],
					file: files[key],
					type: metadataFile.status,
				})
			}
		}

		// save upload list if has one document and change state
		if(uploadCount !== 0){
			this.setState({
				uploadCount: uploadCount,
				uploadList: uploadList,
				loading:true,
			})
		}
	}

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

	render() {
		return (
			<div>
				<PageHeader
					ghost={false}
					title="Requisitos de titulación"
					subTitle="Trámite académico"
					extra={[
						<Tag key="3" visible={this.state.isChange}>
							Tiene cambios sin guardar
						</Tag>,
						<Button
							key="2"
							onClick={() => this.onSave()}
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
							htmlType="submit"
							form="validate-profile"
						>

							Siguiente <ArrowRightOutlined />
						</Button>,
					]}
				>
					<Descriptions size="small" column={1}>
						<Descriptions.Item label={<b>INSTRUCCIONES</b>}>
							Seleccione el tipo de titulación requerido.
							Y cargue la documentación requerida.
						</Descriptions.Item>
					</Descriptions>
				</PageHeader>
				<Divider orientation="center">Plan de estudios</Divider>
				<Form name="select-titulation"
					  onFinish={(values) => this.onFinish(values)}
				>
					<Form.Item label="Tipo de titulación"
							   key={1}
							   rules={[
								   {
									   required: true,
									   message:
										   "Seleccione el tipo de titulación tu nombre!",
								   },
							   ]}
							   hasFeedback
					>
						<Select size="large">
							<Select.Option value="eletromecanica">
								Ing. Electromecánica
							</Select.Option>
							<Select.Option value="electronica">
								Ing. Electrónica
							</Select.Option>
							<Select.Option value="gestion">
								Ing. Gestión Empresarial
							</Select.Option>
							<Select.Option value="industrial">
								Ing. Industrial
							</Select.Option>
							<Select.Option value="mecatronica">
								Ing. Mecatrónica
							</Select.Option>
							<Select.Option value="sistemas">
								Ing. Sistemas Computacionales
							</Select.Option>
							<Select.Option value="administracion">
								Lic. Administración
							</Select.Option>
						</Select>
					</Form.Item>

				</Form>
				<Divider orientation="horizontal">Documentación</Divider>
				{this.props.loading !== true ? (
					<DocumentsTable
						dataSource={this.props.dataSource}
						ref={this.documentsTable}
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
	let fileName = "";
	let status = "empty";
	let url = "";
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
// return true if clasification is for coordination
const getClasification = (metadata) =>{
	const clas = metadata.clasification;
	return clas === 2 || clas === 3;
}

const mapStateToProps = (state) =>{
	let dataSource = [];
	let metadata = null;
	let loading = true;
	if(!state.servdata.loading && state.servdata.payload !== null ) {
		// requireds documents metadata
		metadata = state.servdata.payload
		if (state.account.loading !== true && state.account.payload !== null) {
			// user documents metadata
			let userDoc = state.account.payload.documents;
			for (const key in metadata) {
				// get only coordination documents
				if (getClasification(metadata[key])) {
					if (userDoc[key] === undefined) {
						// if is not document upload from database, push only metadata
						dataSource.push(metadata[key]);
					} else {
						// else push metadata and user document
						dataSource.push(tableMetadata(metadata[key], userDoc[key]))
					}
				}
			}
			loading = false;
		}
	}

	return {
		dataSource: dataSource,
		loading: loading,
		upload: state.upload,
	}
}

const mapDispatchToProps = (dispatch) =>{
	return {
		getDocumentsDetails: ()=>{
			dispatch(actions.processGetDocumentsDetails())
		},
		uploadDocument: (metadata, file, update_type) =>
			dispatch(
				actions.processUploadDocument(metadata, file, update_type)
			),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TypeTitulation);
