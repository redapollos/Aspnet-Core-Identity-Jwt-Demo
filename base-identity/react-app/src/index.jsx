import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import "./sass/index.scss";
import './index.css';
import App from './App';
import { BrowserRouter, Route } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import SystemState from 'context/SystemState';

// const history = createBrowserHistory({});

ReactDOM.render(
    <SystemState>
        <BrowserRouter>
            <Route path="/" component={App} />
        </BrowserRouter>
    </SystemState>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
