import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, /*compose,*/ applyMiddleware } from "redux";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./store/rootReducer";
import es_ES from "antd/lib/locale/es_ES";
import moment from "moment/moment";

const store = createStore(rootReducer, applyMiddleware(thunk)); //, composeEnhances(applyMiddleware(thunk)));

moment.locale("es");
const app = (
  <ConfigProvider locale={es_ES}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
