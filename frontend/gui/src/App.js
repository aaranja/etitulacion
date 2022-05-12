import React from 'react';
import './App.css';
import Header from "./layouts/Header";
import {Outlet} from "react-router-dom";

import 'antd/dist/antd.min.css'

function App() {
    return (
        <div >
            <Header usertype={null} logged={false}/>
            <div className="container">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
