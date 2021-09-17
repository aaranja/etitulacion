import React, { Component } from "react";
import {Button, message, Table, Tag, Upload} from "antd";
import {CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined, UploadOutlined} from "@ant-design/icons";

class DocumentsTable extends Component{
    constructor(props) {
        super(props);
        /*set all files to state */
        let docList = {};
        let preFiles = {};

        for (const key in this.props.dataSource) {
            docList[key] = this.getFileList(this.props.dataSource[key], this.props.dataSource[key].key);
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
    getFileList = (record, key) => {
        if (record !== undefined) {
            const status = record.status === "uploaded" ? "success" : "empty";
            const fileName = record.fileName === undefined ? "" : record.fileName;
            const url = record.url === undefined ? "" : record.url;

            return {
                key: key,
                uid: "-1",
                name: fileName,
                status: status,
                url: url,
            };
        }
        return {};
    };

    onUploadSuccess = (key, status) =>{
        let currentDataSource = this.state.dataSource;
        let currentFileList = this.state.fileList;

        for(const index in currentDataSource){
            const data = currentDataSource[index]
            /*find current key file*/
            if(data.key === key) {

                if(status === "success"){
                    currentDataSource[index].status = "uploaded";
                    currentFileList[index].status = "success";
                } else{
                    if(status === "removed"){
                        currentDataSource[index].status = "removed";
                    }
                }
                this.setState({
                    dataSource: currentDataSource,
                    fileList: currentFileList,
                });
                break;
            }
        }
    }

    onUpload = () =>{
        let currentList = this.state.fileList;
        let currentDataSource = this.state.dataSource;
        let uploadList = {};
        let status;

        for(const key in currentDataSource){
            /* select upload only when doc has status processing or removed*/
            status = currentList[key].status;
            if(status === "processing" || status === "removed"){
                /* parse new status to dataSource */
                let newStatus;
                if(status==="processing"){
                    newStatus = "uploading";
                    currentDataSource[key].status = "loading";
                } else{
                    newStatus = "removed"
                }
                /* save into upload list */
                uploadList[key] = {
                    key: currentDataSource[key].key,
                    keyName: currentDataSource[key].keyName,
                    fileName: currentList[key].name,
                    status: newStatus,
                    url: `www.etitulacion.com/documentos/egresado/${currentDataSource[key].keyName}`,
                };
            }
        }
        this.setState({
            dataSource: currentDataSource,
            uploading: true,
            newChanges: false,
        });

        return [uploadList, this.state.files]

    }

    render(){

        const dataColumns = [
            {
                title: "Documento",
                dataIndex: "fullName",
                width: "20%"
            },
            {
                title: "Descripción",
                dataIndex: "description",
                width: "40%",
                render: (text) =>{
                    return text;
                }
            },
            {
                title: "Estatus",
                dataIndex: "status",
                width: "10%",
                render: (text) =>{
                    let icon = <ExclamationCircleOutlined />;
                    let color = "default"
                    let message = "Sin cargar"

                    if(text === "uploaded"){
                        icon = <CheckCircleOutlined />;
                        color = "success";
                        message = "Cargado";
                    } else{
                        if(text==="loading"){
                            icon = <SyncOutlined spin />;
                            color="processing";
                            message = "Subiendo";
                        }
                    }
                    return (<Tag icon = {icon} color={color} style={{width: "100%"}}>{message}</Tag>)
                }
            },
            {
                title: "Archivo",
                dataIndex: "archivo",
                render: (text, record) =>{
                    const uploadProps = {
                        onRemove: (info, key = record.key) => {
                            let fileList = this.state.fileList;
                            let dataTable = this.state.dataSource;
                            let files = this.state.files;

                            for(const index in fileList){
                                const data = fileList[index];
                                if(data.key === key){
                                    /* remove metadata */
                                    fileList[index].status = "removed";
                                    fileList[index].name = "";
                                    /* set new props in table to empty file */
                                    dataTable[index].fileName = "";
                                    dataTable[index].status = "removed";
                                    /* remove file from files */
                                    files[index] = null;
                                    /* update state to reload table with new props */
                                    this.setState({
                                        dataSource: dataTable,
                                        fileList: fileList,
                                        files: files,
                                    });
                                    this.props.callBack(true, "removed");
                                    break;
                                }
                            }
                        },
                        maxCount: 1,
                        beforeUpload: (file) => {
                            if (file.type !== "application/pdf") {
                                message.error(
                                    `${file.name} no es un archivo PDF!`
                                );
                            } else {
                            }
                            return false;
                        },
                        onChange: (info, key = record.key) => {
                            let fileList = this.state.fileList;
                            let newFile = info.fileList[0];
                            let dataTable = this.state.dataSource;
                            let files = this.state.files;

                            /*set a new file*/
                            if (info.fileList.length === 1) {
                                /* only update fileList if the new document is a PDF*/
                                if (newFile.type === "application/pdf") {
                                    /*get metadata file from fileList*/
                                    for(const index in this.state.fileList){
                                        const data = this.state.fileList[index]
                                        /*find current key file*/
                                        if(data.key === key){
                                            /* set new metadata */
                                            fileList[index] = newFile;
                                            fileList[index].status = "processing";
                                            fileList[index].key = data.key;
                                            /* set new props in datasource */
                                            dataTable[index].fileName = newFile.name;
                                            dataTable[index].status = "unloaded";
                                            /* store new file into files */
                                            files[index] = info.file;
                                            /* change to state to reload table props */
                                            this.setState({
                                                dataSource: dataTable,
                                                fileList: fileList,
                                                files: files,
                                            });
                                            /* set changes to save in parent component */
                                            this.props.callBack(true, "uploaded");
                                            break;
                                        }
                                    }
                                }
                            }
                        },
                        multiple: false,
                    }

                    // show upload button
                    let uploadButton = (
                        <Button>
                            <UploadOutlined /> Elegir archivo
                        </Button>
                    );

                    // find current file in fileList
                    let file;
                    for(const key in this.state.fileList){
                        const filedata = this.state.fileList[key]
                        if(filedata.key === record.key){
                            file = filedata
                            break;
                        }
                    }

                    // check status file
                    let fileList;
                    if (
                        file.status === "success" ||
                        file.status === "processing"
                    ) {
                        // hide upload button if file is uploaded or uploading
                        uploadButton = null;
                        fileList = [file];
                    } else {
                        // show upload button and clean fileList
                        fileList = null;
                    }

                    // set upload props and filelist
                    return <Upload
                        {...uploadProps}
                        fileList={fileList}
                        showUploadList={{
                            showRemoveIcon: true,
                        }}
                    >
                        {uploadButton}
                    </Upload>
                }
            }
        ]

        const columns = dataColumns.map((col) => {
            return col;
        });

        return <Table
            pagination={false}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={this.state.dataSource}
            columns={columns}
            style={{ fontSize: "110%" }}
            extra={[<p>hola</p>]}
        />

    }
}
export default DocumentsTable;