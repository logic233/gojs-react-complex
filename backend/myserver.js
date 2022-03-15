var http = require("http");
const fs = require('fs');
var querystring = require('querystring');
const urlLib = require('url');
var util = require('util');

const modelFilePath = 'C:\\project\\gojs-react-complex\\backend\\model.json'


http.createServer(function (req, res) {
    if (req.method === "GET") {
        let obj = urlLib.parse(req.url, true);

        res.setHeader("Access-Control-Allow-Origin", "*");

        let filePath = "";
        switch (obj.query.type) {
            case "model":
                filePath = modelFilePath;
                break;
            case "tree":
                filePath = 'C:\\project\\gojs-react-complex\\backend\\packageInfo.json';
                break;
        }

        if (filePath.length !== 0) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                res.write(data);
            } catch (err) {
                console.log(`Error reading file from disk: ${err}`);
                res.write("file not exist.")
            }
        } else {
            res.write("Incorrect get Request.")
        }
        res.end();
        //POST请求
    } else {
        // 定义了一个post变量，用于暂存请求体的信息
        let post = '';

        // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        req.on('data', function (chunk) {
            post += chunk;
        });

        // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        req.on('end', function () {
            // post = querystring.parse(post);
            // console.log(typeof(post));
            //写入
            fs.writeFile(modelFilePath, post, function (err) {
                if (err) {
                    res.status(500).send('Server is error...')
                }
            })
            console.log("has save..")

            res.end(util.inspect(post));
        });
    }

}).listen(9999);


console.log("have fun!!");