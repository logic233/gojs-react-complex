import React from 'react';
import ReactDOM from 'react-dom';
import ProjectSever from './App';

import * as fs from 'fs';
import ProjectManager from "./ProjectManager";

// const packageInfo = require('./tool/packageInfo.json')

function getDataJson(kind: string) {
    let url = "http://localhost:9999?type=" + kind
    let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
    //需要异步请求
    httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.send();//第三步：发送请求  将请求参数写在URL中

    let dataJson = JSON.parse(httpRequest.responseText);

    return dataJson;

}

let state = "List";

// ReactDOM.render(<ProjectSever GoJSmodel={getDataJson("model")}
//                      treeInfo={getDataJson("tree")["tree_info"]}
//                      ModelicaModelItem={getDataJson("item")["model_info"]}
//     />,
//     document.getElementById('root')
// );
ReactDOM.render(<ProjectManager
    />,
    document.getElementById('root')
);