import React, {Component} from 'react';

import {Upload, message} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {uploadDocument} from "../../services/documents";
import Login from "../../pages/Login";

const { Dragger } = Upload;

class UploadFile extends Component {
    render() {
        const propsDragger = {
            name: 'file',
            multiple: false,
            onChange(info) {
                console.log('onChange')
                const { status } = info.file;
                if (status !== 'uploading') {
                    
                }
                if (status === 'done') {
                    window.toastr.success('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')

                } else if (status === 'error') {
                    window.toastr.error('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')
                }
            },
            beforeUpload: (file) => {


                let reader = new FileReader();
                reader.onload = (e) => {
                    console.log(e.target.result)

                    var raw = new Buffer(Buffer.from(e.target.result, 'base64').toString('ascii'), 'base64')
                    
                    const data= new FormData()
                    data.append('files',file)
                    
                    uploadDocument(data)
                };
                reader.readAsDataURL(file);
                
                

                // console.log(file)
                // let formData = new FormData();
                // formData.append('files', file);
                //
                // uploadDocument(formData)
                //
                // const reader = new FileReader();
                //
                // reader.onload = e => {
                //     const url = window.URL.createObjectURL(file);
                //     var a = document.createElement("a");
                //     a.href = url;
                //     a.download = "Image.png";
                //     // a.click();
                // };
                // reader.readAsText(file);
                //
                // // Prevent upload
                // return false;
            },
            customRequest: (options) => {
                console.log('qwdqwdqwdqdwqwdqwdqw')
                console.log(options)

                
                const data= new FormData()
                data.append('files', options.files)
                // uploadDocument(data)
            }
        };
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">
                        <i className="fas fa-file mr-2" />
                        {this.props.title}
                    </h3>
                </div>
                <div className="card-body">
                    <Dragger {...propsDragger}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                        </p>
                    </Dragger>
                </div>
            </div>
        );
    }
}

export default UploadFile;