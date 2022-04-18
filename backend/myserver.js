const express = require('express') //引入express 模块
const app = express()              //创建实例
const mysql = require('mysql')
var bodyParser = require('body-parser');
const urlLib = require("url");
const fs = require("fs");
const util = require("util");     //引入mysql 模块
// 创建数据库连接 填入数据库信息
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'webmodelica'
});
// 测试连接
conn.connect()
// 开启服务器
app.listen(9999, () => {
    console.log('服务器在9999端口开启。。。。。');
})
app.get('/projectList', (req, res) => {
    let sqlStr = "SELECT id,name,annotation,create_time,update_time  from project"
    //执行mysql 语句
    conn.query(sqlStr, (err, results) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.send(results);
    })
})

app.get('/', (req, res) => {
    //处理get请求
    var sqlStr, sqlPara = [1];

    let obj = urlLib.parse(req.url, true);
    console.log(obj.query);
    switch (obj.query.type) {
        case "item":
            sqlStr = "SELECT model_info  from package where id= ? ";
            sqlPara = [2];
            break;
        case "tree":
            sqlStr = "SELECT tree_info  from package where id= ? ";
            sqlPara = [2];
            break;
        case "model":
            sqlStr = "SELECT info  from project where id= ? ";
            sqlPara = [obj.query.id];
            break;
    }
    //执行mysql 语句
    conn.query(sqlStr, sqlPara, (err, results) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        results = JSON.parse(JSON.stringify(results[0]));
        results = Object.values(results)[0];
        res.send(results);

    })

})
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/',urlencodedParser,(req, res) => {
    //处理get请求
    var sqlStr, sqlPara ;
    console.log("POST!");
    console.log("req :",req.body)
    sqlStr = "UPDATE project SET info = ? WHERE id = ?"

    sqlPara = [req.body["info"], req.body["id"]];
    console.log(sqlPara);
    //写入
    //执行mysql 语句
    conn.query(sqlStr, sqlPara, (err, results) => {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    })
    res.end("has save");
    // conn.end();

})

app.get('/packageList', (req, res) => {
    let sqlStr = "SELECT id,name,annotation,create_time,update_time  from package"
    //执行mysql 语句
    conn.query(sqlStr, (err, results) => {
        res.send(results);
    })
})