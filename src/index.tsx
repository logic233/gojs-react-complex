import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import * as fs from 'fs';
function getDataJson() {
    var url = "http://localhost:9999/"
    var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
    //需要异步请求
    httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.send();//第三步：发送请求  将请求参数写在URL中
    /**
     * 获取数据后的处理程序
     */
    // httpRequest.onreadystatechange = function () {
    //     if (httpRequest.readyState == 4 && httpRequest.status == 200) {
    //         dataJson = JSON.parse(httpRequest.responseText);//获取到json字符串，还需解析
    //         console.log('dataJson: ', dataJson);
    //         // return dataJson;
    //     }
    // };
    var dataJson = JSON.parse(httpRequest.responseText);
    console.log('dataJson: ', dataJson);
    return dataJson;
   
}


ReactDOM.render(<App model={getDataJson()} />, document.getElementById('root'));

// const dataJson = require('./model.json');
// ReactDOM.render(<App model={dataJson} />, document.getElementById('root'));