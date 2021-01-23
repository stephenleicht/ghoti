// import 'reflect-metadata';
import 'normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';

const app = document.getElementById('app');

const ghotiMeta = (window as any).__ghotiMeta__;

ReactDOM.render((
    <Router basename="/admin">
        <App models={ghotiMeta.models} />
    </Router>
), app);
