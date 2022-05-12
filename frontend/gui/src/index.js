import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import store from "./store/store";
import reportWebVitals from './reportWebVitals';
import './index.css';
import BaseRouter from "./routes/baseRouter";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Provider store={store}>
    <BaseRouter/>
</Provider>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
