const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const server = http.createServer(function(req, res) {
    console.log('adres url: ' + req.url);
    console.log(req.method);

    switch (req.method) {
    case 'GET':
        let adres = req.url;
        adres = adres.split('.');
        let extension = adres[adres.length - 1];
        const staticDir = 'static';
        console.log(extension);

        if (req.url === '/libs/jquery-3.4.1.min.js') {
            fs.readFile('.' + req.url, function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript',
                });
                res.write(data);
                res.end();
            });
        }
        if (req.url === '/libs/three.js') {
            fs.readFile('.' + req.url, function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript',
                });
                res.write(data);
                res.end();
            });
        }

        if (extension == '/') {
            fs.readFile(staticDir + '/index.html', function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8',
                });
                res.write(data);
                res.end();
            });
        } else if (extension == 'js' && req.url.search('jquery') < 0 && req.url.search('three') < 0) {
            fs.readFile(staticDir + req.url, function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript',
                });
                res.write(data);
                res.end();
            });
        } else if (extension == 'css') {
            fs.readFile(staticDir + req.url, function(_error, data) {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(data);
                res.end();
            });
        } else if (extension == 'jpg') {
            fs.readFile(__dirname + req.url, function(_error, data) {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.write(data);
                res.end();
            });
        } else if (extension == 'png') {
            fs.readFile(__dirname + decodeURI(req.url), function(_error, data) {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.write(data);
                res.end();
            });
        }

        break;

    case 'POST':
        servResponse(req, res);
        break;
    }
});

server.listen(3000, function() {
    console.log('server on port: 3000');
});

const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
let db;

// mongoClient.connect('mongodb://localhost/3ic2', (err, _db) => {
//     if(err) console.log(err);
//     else console.log("polaczono!");
//     db = _db;
//     _db.createCollection("testowa", function (err, coll) {
//         console.log('kolekcja powstala');
//         // coll.insert({a: 1}, function (err, res) {
//         //     console.log('dokument powstal');
//         // })
//     })
// })

const opers = require('./modules/Operations.js');


function servResponse(req, res) {
    let allData = '';

    req.on('data', function(data) {
        console.log('data: ' + data);
        allData += data;
    });

    req.on('end', function() {
        const finish = qs.parse(allData);
        const coll = db.collection("testowa");

        var result = null;
        switch (finish.action) {
        case 'addUser':
            result = {login: finish.login, pass: finish.pass};
            opers.Insert(coll, result);

            res.end(JSON.stringify(result, null, 2));
            break;

        case 'refreshUsers':
            opers.SelectAll(coll, (data) => {
                console.log('oonserver');
                console.log(data);
                result = {data};
                res.end(JSON.stringify(result, null, 2));

            });
            // res.end(JSON.stringify(result, null, 2));
            break;

        case 'removeUser':
            opers.DeleteById(ObjectID, coll, finish.id);
            res.end(JSON.stringify(null, null, 2));

            break;

        case 'updatePass':
            console.log('witaj'+finish.pass);
            result = {id: finish.id, pass: finish.pass};
            opers.UpdateById(ObjectID, coll, result);
            res.end(JSON.stringify(null, null, 2));
            break;
        }
    });
}