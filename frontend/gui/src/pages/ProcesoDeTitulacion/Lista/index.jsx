import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actionTypes from "../../../redux/actions";


class Lista extends Component {
    constructor(props) {
        super(props);

        this.props.onLoadPage({
            path:'/lista',
            title:'Lista de ',
            breadcrumb:'lista'
        });

    }
    render() {
        return (
            <div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadPage: (page) => dispatch({type:actionTypes.WRITE_ACTUAL_PAGE,page})
    };
};

export default connect(null,mapDispatchToProps)(Lista);