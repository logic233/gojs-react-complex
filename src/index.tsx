import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// import * as fs from 'fs';

const dataJson = require('./model.json');



ReactDOM.render(<App model= {dataJson} />, document.getElementById('root'));
