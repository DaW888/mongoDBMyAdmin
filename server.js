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

let ip = null;

function servResponse(req, res) {
    let allData = '';

    req.on('data', function(data) {
        console.log('data: ' + data);
        allData += data;
    });

    req.on('end', function() {
        const finish = qs.parse(allData);
        // const coll = db.collection("testowa");

        const result = {};

        switch (finish.action) {
        case 'setAddress':
            ip = finish.ip;
            mongoClient.connect(`mongodb://${finish.ip}/`, (err, _db) => {
                if(err){
                    console.log(err);
                    res.end(JSON.stringify('error', null, 2));
                }
                else {
                    console.log("polaczono!");
                    result.ip = 'Polaczono z Localhost';
                    db = _db;
                    db.admin().listDatabases((err, dbs) => {
                        if(err) console.log(err);
                        else{
                            console.log(dbs.databases);
                            console.log(dbs);
                            const dbsFiltered = dbs.databases.filter(db =>{
                                return db.name != 'admin' && db.name != 'config' && db.name != 'local';
                            })
                            result.dbs = dbsFiltered;
                            console.log(dbsFiltered);
                            res.end(JSON.stringify(result, null, 2));
                            
                        }
                    })
                }
            })
            break;

        case 'getCollOfDB':
            console.log(ip, finish.name);
            mongoClient.connect(`mongodb://${ip}/${finish.name}`, (err, _db) => {
                if(err) console.log(err);
                else console.log("polaczono!");
                db = _db;
                _db.listCollections().toArray((err, colls) => {
                    if(err) console.log(err);
                    else {
                        console.log(colls);
                        res.end(JSON.stringify(colls, null, 2));
                    }
                })
            })
            break;

        case 'addDataBase':
            mongoClient.connect(`mongodb://${ip}/${finish.name}`, (err, _db) => {
                if(err) console.log(err);
                else console.log("created!"+ finish.name);
                db = _db;
                db.admin().listDatabases((err, dbs) => {
                    if(err) console.log(err);
                    else{
                        _db.createCollection("testowa", function (err, coll) {
                            res.end(JSON.stringify(null, null, 2));
                        })
                    }
                })
            })
            break;

        case 'getDataBases':
                mongoClient.connect(`mongodb://${ip}/`, (err, _db) => {
                    if(err){
                        console.log(err);
                        res.end(JSON.stringify('error', null, 2));
                    }
                    else {
                        _db.admin().listDatabases((err, dbs) => {
                            if(err) console.log(err);
                            else{
                                console.log(dbs.databases);
                                console.log(dbs);
                                const dbsFiltered = dbs.databases.filter(db =>{
                                    return db.name != 'admin' && db.name != 'config' && db.name != 'local';
                                })
                                result.dbs = dbsFiltered;
                                console.log(dbsFiltered);
                                res.end(JSON.stringify(result, null, 2));
                                
                            }
                        })
                    }
                })
            break;
        
        case 'removeDataBase':
                mongoClient.connect(`mongodb://${ip}/${finish.name}`, (err, _db) => {
                    if(err){
                        console.log(err);
                        res.end(JSON.stringify('error', null, 2));
                    }
                    else {
                        _db.dropDatabase((err, result) => {
                            if(err) console.log(err);
                            else {
                                console.log('deleted'+ finish.name);
                                res.end(JSON.stringify(null, null, 2));
                            }
                        })
                    }
                })
            break;

        case 'addCollection':
            mongoClient.connect(`mongodb://${ip}/${finish.dbName}`, (err, _db) => {
                if(err){
                    console.log(err);
                    res.end(JSON.stringify('error', null, 2));
                }
                else {
                    _db.createCollection(finish.collName, function (err, coll) {
                        res.end(JSON.stringify(finish, null, 2));
                    })
                }
            })
            break;

        case 'removeCollection':
            mongoClient.connect(`mongodb://${ip}/${finish.dbName}`, (err, _db) => {
                if(err){
                    console.log(err);
                    res.end(JSON.stringify('error', null, 2));
                }
                else {
                    _db.dropCollection(finish.collName, function (err, coll) {
                        if(err) console.log(err);
                        res.end(JSON.stringify(finish, null, 2));
                    })
                }
            })
            break;
        case 'getDataFromColl':
            mongoClient.connect(`mongodb://${ip}/${finish.dbName}`, (err, _db) => {
                if(err){
                    console.log(err);
                    res.end(JSON.stringify('error', null, 2));
                }
                else {
                    const coll = db.collection(finish.collName);
                    opers.SelectAll(coll, (data) => {
                        console.log(data);
                        res.end(JSON.stringify(data, null, 2));
                    })
                }
            })
            break;

        case 'delDataEl':
            mongoClient.connect(`mongodb://${ip}/${finish.dbName}`, (err, _db) => {
                if(err){
                    console.log(err);
                    res.end(JSON.stringify('error', null, 2));
                }
                else {
                    const coll = db.collection(finish.collName);
                    opers.DeleteById(ObjectID, coll, finish.idEl);
                    result.dbName = finish.dbName;
                    result.collName = finish.collName;
                    res.end(JSON.stringify(result, null, 2));

                }
            })
            break;
        }
    });
}

