import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";

class Breadcrumb extends Component {
    render() {
        return (
            <div>
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">{this.props.page.title}</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
                                    <li className="breadcrumb-item active">{this.props.page.breadcrumb}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        page: state.page
    }
};

export default connect(mapStateToProps)(Breadcrumb);