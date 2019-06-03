class Net {
    constructor() {
        console.log('konstruktor klasy Net');
    }

    // wyslanie nazwy uzytkownika na serwer
    // odbior: canLogin, message, if(canLogin){to też users[]}
    addUser(login, pass) {
        $.ajax({
            url: '../server.js',
            data: { action: 'addUser', login: login, pass: pass},
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
    refreshUsers(){
        $.ajax({
            url: '../server.js',
            data: { action: 'refreshUsers'},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                main.getData(obj.data);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    removeUser(id){
        $.ajax({
            url: '../server.js',
            data: { action: 'removeUser', id},
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

    updatePass(id, pass){
        $.ajax({
            url: '../server.js',
            data: { action: 'updatePass', id, pass},
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