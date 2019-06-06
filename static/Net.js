class Net {
    constructor() {
        console.log('konstruktor klasy Net');
    }

    // wyslanie nazwy uzytkownika na serwer
    // odbior: canLogin, message, if(canLogin){to też users[]}
    setAddress(ip) {
        $.ajax({
            url: '../server.js',
            data: { action: 'setAddress', ip},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                main.setAddressDiv(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }
    getCollOfDB(name){
        $.ajax({
            url: '../server.js',
            data: { action: 'getCollOfDB', name },
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                main.setCollectionList(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    addDataBase(name){
        $.ajax({
            url: '../server.js',
            data: { action: 'addDataBase', name},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                net.getDataBases();
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    getDataBases(){
        $.ajax({
            url: '../server.js',
            data: { action: 'getDataBases'},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                main.setDataBases(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    removeDataBase(name){ //addCollection
        $.ajax({
            url: '../server.js',
            data: { action: 'removeDataBase', name},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                net.getDataBases();
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }
    
    addCollection(dbName, collName){
        $.ajax({
            url: '../server.js',
            data: { action: 'addCollection', dbName, collName},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    removeCollection(dbName, collName){
        $.ajax({
            url: '../server.js',
            data: { action: 'removeCollection', dbName, collName},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                net.getDataBases();
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    getDataFromColl(dbName, collName){
        $.ajax({
            url: '../server.js',
            data: { action: 'getDataFromColl', dbName, collName},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                main.setDataFromColl(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    delDataEl(dbName, collName, idEl){
        $.ajax({
            url: '../server.js',
            data: { action: 'delDataEl', dbName, collName, idEl},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                net.getDataFromColl(obj.dbName, obj.collName);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    updateDataEl(dbName, collName, idEl, data){
        $.ajax({
            url: '../server.js',
            data: { action: 'updateDataEl', dbName, collName, idEl, data:JSON.stringify(data, null ,2)},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }
}