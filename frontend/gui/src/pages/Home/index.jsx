import React, {Component} from 'react';
import {Outlet} from "react-router-dom"

class Home extends Component {
    render() {
        return <div>
            <p>Página de inicio </p>
            <Outlet/>
        </div>
    }
}

export default Home;