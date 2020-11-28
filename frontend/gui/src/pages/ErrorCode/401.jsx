import React, {Component} from 'react';
import {Link} from "react-router-dom";

let ss = {
    position:'absolute',
    top:'50%',
    left:'50%',
    transform:'translate(-50%, -100%)',
};

class P401 extends Component
{
    render()
    {
        return (
            <div style={ss}>
                <div className="error-page">
                    <h2 className="headline text-warning"> 401</h2>
                    <div className="error-content" style={{paddingTop:20}}>
                        <h3><i className="fas fa-exclamation-triangle text-warning" /> Unauthorized.</h3>
                        <p>
                            You need to be logged in to see this content.
                            Meanwhile, you may <Link to="/login">return to Login</Link>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default P401;