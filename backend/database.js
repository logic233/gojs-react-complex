var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'webmodelica'
});

exports.packageInsert = (name, sourcepath, annotation, tree_info, model_info) => {
    connection.connect();
    var addSql = "INSERT INTO package(name,sourcepath,annotation,tree_info,model_info) VALUES(?,?,?,?,?);";
    var addSqlParams = [name, sourcepath, annotation, JSON.stringify(tree_info), JSON.stringify(model_info)];

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
}

exports.projectInsert = (name, annotation) => {
    connection.connect();
    var addSql = "INSERT INTO project(name,annotation) VALUES(?,?);";
    var addSqlParams = [name, annotation];

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
}

//以后加参数
exports.projectUpdate = (id, info) => {
    connection.connect();
    var modSql = 'UPDATE project SET info = ? WHERE id = ?';
    var modSqlParams = [JSON.stringify(info), id];
//改
    connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return;
        }
        console.log('--------------------------UPDATE----------------------------');
        console.log('UPDATE affectedRows', result.affectedRows);
        console.log('-----------------------------------------------------------------\n\n');
    });
    connection.end();
}
exports.projectSelectById = (id) => {
    connection.connect();
    var Sql = 'SELECT * from project WHERE id = ?';
    var SqlParams = [id];
    var res;
//查
    connection.query(Sql, SqlParams, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        result = JSON.parse(JSON.stringify(result));

        console.log('--------------------------SELECT----------------------------');
        console.log('SELECT:', result[0]);
        console.log('-----------------------------------------------------------------\n\n');
        res = result[0];
    });
    connection.end();
    return res;
}
