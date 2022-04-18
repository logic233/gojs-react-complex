var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'webmodelica'
});

let model =
    {
        "node": [
            {
                "key": 1,
                "text": "Inductor",
                "color": "orange",
                "loc": "-110.34892221487371 60.9274401466404",
                "modelicaName": "Modelica.Electrical.Analog.Basic.Inductor",
                "parameterValues": {},
                "conn": [
                    {
                        "name": "p",
                        "pos": [
                            0,
                            0.5
                        ]
                    },
                    {
                        "name": "n",
                        "pos": [
                            1,
                            0.5
                        ]
                    }
                ]
            },
            {
                "key": 2,
                "text": "Resistor1",
                "color": "lightgreen",
                "loc": "-365.37347188531425 -48.094863393916754",
                "modelicaName": "Modelica.Electrical.Analog.Basic.Resistor",
                "parameterValues": {
                    "R": 12,
                    "alpha": 1
                },
                "conn": [
                    {
                        "name": "p",
                        "pos": [
                            0,
                            0.5
                        ]
                    },
                    {
                        "name": "n",
                        "pos": [
                            1,
                            0.5
                        ]
                    },
                    {
                        "name": "heatPort",
                        "pos": [
                            0.5,
                            1
                        ]
                    }
                ]
            },
            {
                "key": 3,
                "text": "Resistor2",
                "color": "lightgreen",
                "loc": "-625.0385517397312 -92.09486339391675",
                "modelicaName": "Modelica.Electrical.Analog.Basic.Resistor",
                "parameterValues": {
                    "R": 222
                },
                "conn": [
                    {
                        "name": "p",
                        "pos": [
                            0,
                            0.5
                        ]
                    },
                    {
                        "name": "n",
                        "pos": [
                            1,
                            0.5
                        ]
                    },
                    {
                        "name": "heatPort",
                        "pos": [
                            0.5,
                            1
                        ]
                    }
                ]
            }
        ],
        "link": [
            {
                "from": 2,
                "to": 1,
                "fromPort": "n",
                "toPort": "p",
                "key": -1
            },
            {
                "from": 3,
                "to": 2,
                "fromPort": "n",
                "toPort": "p",
                "key": -2
            }
        ]
    }

connection.connect();
var addSql = "UPDATE project  SET info  = ? WHERE id = 1 VALUES(?);";
var addSqlParams = [model];

connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
    }
    console.log('--------------------------INSERT----------------------------');
    console.log('INSERT ID:', result);
    console.log('-----------------------------------------------------------------\n\n');
});
connection.end();