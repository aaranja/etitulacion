import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actionTypes from "../../../redux/actions";

import {message} from 'antd';
import TestUpload from "../../../components/UploadFile/upload";
import {uploadDocument} from "../../../services/documents";

class SubirDocumentos extends Component {
    constructor(props) {
        super(props);
        
        this.props.onLoadPage({
            path:'/subir-documentos',
            title:'Subir Documentos',
            breadcrumb:'Subir Documentos'
        })
    }
    startProcess = () => {
        
        let formData = new FormData();
        
        this.props.files.map(item => {
            formData.append(item.type,item.data)
        });
        
        formData.append('type','classic');
        
        uploadDocument(formData);
    };
    render() {
        return (
            <>
                <div className='row'>
                    <div className='col-md-12'>
                        <TestUpload title='Acta de nacimiento' type='birthday-certificate'/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <TestUpload title='Residencia' type='residence-certificate'/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <TestUpload title='Certificado del Tecnologico' type='tec-certificate'/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button className='btn btn-primary float-right' onClick={this.startProcess}>Comenzar Proceso</button>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        files: state.files
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPage: (page) => dispatch({type:actionTypes.WRITE_ACTUAL_PAGE,page})
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(SubirDocumentos);