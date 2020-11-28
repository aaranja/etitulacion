import React, {Component} from 'react';
import {Link} from "react-router-dom";

let ss = {
    position:'absolute',
    top:'50%',
    left:'50%',
    transform:'translate(-50%, -100%)',
};

class P404 extends Component
{
    render()
    {
        return (
            <div style={ss}>
                <div className="error-page">
                    <h2 className="headline text-warning"> 404</h2>
                    <div className="error-content" style={{paddingTop:20}}>
                        <h3><i className="fas fa-exclamation-triangle text-warning" /> Oops! Page not found.</h3>
                        <p>
                            We could not find the page you were looking for.
                            Meanwhile, you may <Link to="/dashboard">return to dashboard</Link>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default P404;