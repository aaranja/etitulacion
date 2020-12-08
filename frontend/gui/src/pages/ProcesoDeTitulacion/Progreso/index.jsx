import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actionTypes from "../../../redux/actions";

class ProgresoTitulacion extends Component {
    constructor(props) {
        super(props);

        this.props.onLoadPage({
            path:'/progreso',
            title:'Progreso de Titulacion',
            breadcrumb:'progreso'
        });

    }
    render() {
        let i =0;
        return (
            <div className='timeline'>
                {
                    this.props.titulation.logs.map((item,index,array)=>{
                        if (item.type === 'step'){
                            return (
                                <div className="time-label">
                                    <span className="bg-blue">{item.date}</span>
                                </div>
                            )
                        }else {
                            return (
                                <div>
                                    <i className={item.icon}/>
                                    <div className="timeline-item">
                                        <span className="time"><i
                                            className="fas fa-clock mr-1"/>{item.date.split(' ')[1]}</span>
                                        <h3 className="timeline-header no-border">{item.title}</h3>
                                        <div className="timeline-body">
                                            {item.comments}
                                        </div>
                                    </div>
                                </div>
                            )
                        }    
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        titulation: state.titulation
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPage: (page) => dispatch({type:actionTypes.WRITE_ACTUAL_PAGE,page})
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ProgresoTitulacion);