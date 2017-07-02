// import 'reflect-metadata';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

const app = document.getElementById('app');

const ghotiMeta = (window as any).__ghotiMeta__;

console.log(ghotiMeta);

ReactDOM.render(<App />, app);
