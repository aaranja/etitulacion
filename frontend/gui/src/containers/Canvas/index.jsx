import React, {Component} from 'react';

import {Route, Switch} from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";

import {connect} from 'react-redux';

import Home from '../../pages/Home'

import SubirDocumentos from '../../pages/ProcesoDeTitulacion/Etapas/CargaDeArchivos';
import ProgresoTitulacion from "../../pages/ProcesoDeTitulacion/Progreso";
import Lista from "../../pages/ProcesoDeTitulacion/Lista";
import * as actionTypes from "../../redux/actions";

import {getCurrentUser} from "../../services/requests";

class Canvas extends Component {
    constructor(props) {
        super(props);
        getCurrentUser()
            .then(data => {
                this.props.registerUser(data);
            })
    }
    
    render() {
        return (
            <div>
                <Sidebar/>
                <Header/>
                <div className="content-wrapper">
                    <Breadcrumb/>
                    <section className="content">
                        <div className="container-fluid">
                            
                            <Switch>
                                <Route path="/home" exact component={Home} />
                                <Route path="/subir-documentos" exact component={SubirDocumentos} />
                                <Route path="/progreso" exact component={ProgresoTitulacion} />
                                <Route path="/lista" exact component={Lista} />
                                <Route path="/"  component={Home} />
                            </Switch>
                            
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        registerUser: (user) => dispatch({type: actionTypes.WRITE_USER,user}),
    };
};
export default connect(null, mapDispatchToProps)(Canvas);