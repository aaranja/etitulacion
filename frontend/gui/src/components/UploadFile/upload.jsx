import React, {Component} from 'react';

import {uploadDocument} from "../../services/documents";

import {connect} from "react-redux";
import * as actionTypes from "../../redux/actions";

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    onChargeFile = (e) =>{
        
        let src = URL.createObjectURL(e.target.files[0]);
        
        let file = {
            data: e.target.files[0],
            type: this.props.type,
            src,
        };
        
        this.setState({file});
        
        this.props.uploadFile(file)
        
        
    };
    onUploadFile = () => {
        // const data = new FormData();
        // data.append('files',this.state.file.data);
        // data.append('type',this.state.file.type);
        // uploadDocument(data)
    };
    
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">
                        <i className="fas fa-file mr-2" />
                        {this.props.title}
                    </h3>
                </div>
                <div className="card-body">
                    <div className='card collapsed-card'>
                        <div className=''>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="exampleInputFile" onChange={this.onChargeFile}/>
                                    <label className="custom-file-label" htmlFor="exampleInputFile">Seleccionar Archivo</label>
                                </div>
                                <div className="input-group-append">
                                    {
                                        (this.state.file) ?
                                            <>
                                                <button type='button' className='input-group-text' data-card-widget="maximize">
                                                    Mostrar
                                                </button>
                                            </>:
                                            <>
                                                <button type='button' className='btn input-group-text disabled'>
                                                    Mostrar
                                                </button>
                                            </>
                                    }
                                    
                                </div>
                            </div>
                            
                        </div>
                        <div className='card-body'>
                                <embed src={this.state.file ? this.state.file.src : ''} width='100%' height='100%'/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        uploadFile: (file) => dispatch({type:actionTypes.UPLOAD_FILE,file}),
    };
};

export default connect(null,mapDispatchToProps)(UploadFile);