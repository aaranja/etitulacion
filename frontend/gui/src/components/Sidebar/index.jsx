import React, {Component} from 'react';
import {Link} from "react-router-dom";

import {connect} from 'react-redux';

import * as actionTypes from './../../redux/actions';

class Sidbar extends Component {
    constructor(arg) {
        super(arg);
        
    }
    render() {
        return (
            <div>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    <Link to="/" className="brand-link">
                        <img src="dist/img/AdminLTELogo.png" alt="ß" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
                        <span className="brand-text font-weight-light">eTitulacion</span>
                    </Link>
                    <div className="sidebar">
                        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div className="image">
                                <img src="dist/img/avatar5.png" className="img-rounded elevation-2" alt="User Image" />
                            </div>
                            <div className="info">
                                <Link to="/profile" className="d-block">{this.props.user.all_name}</Link>
                            </div>
                        </div>
                        
                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                
                                <li className="nav-item"/>


                                {/* -- Estudiantes Egresados--*/}
                                {this.props.user.roles.includes("ESTUDIANTE") ? (
                                    <>
                                        <li className="nav-header">EGRESADOS</li>
                                        <li className="nav-item">
                                            <Link to="/subir-documentos" className="nav-link">
                                                <i className="nav-icon fas fa-file-import" />
                                                <p>
                                                    Subir Documentos
                                                </p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/progreso" className="nav-link">
                                                <i className="nav-icon fas fa-history" />
                                                <p>
                                                    Progreso
                                                </p>
                                            </Link>
                                        </li>
                                    </>
                                ) : (<li/>)}

                                {/* -- Servicios Escolares--*/}
                                {this.props.user.roles.includes("ESCOLARES") ? (
                                    <>
                                        <li className="nav-header">SERVICIOS ESCOLARES</li>
                                    </>
                                ) : (<li/>)}

                                {/* -- Coordinacion de Titulacion--*/}
                                {this.props.user.roles.includes("COORDINACION") ? (
                                    <>
                                        <li className="nav-header">COORDIANCION DE TITULACION</li>
                                        <li className="nav-item">
                                            <Link to="/lista" className="nav-link">
                                                <i className="nav-icon fas fa-list-ul" />
                                                <p>
                                                    Lista
                                                </p>
                                            </Link>
                                        </li>
                                    </>
                                ) : (<li/>)}
                            </ul>
                        </nav>
                    </div>
                    
                </aside>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    };
};


export default connect(mapStateToProps)(Sidbar);