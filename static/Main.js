class Main {
    constructor () {
        this.start();
        this.addButtons();
        this.data = [];
    }

    start() {
        let ip = prompt("Podaj IP servera bazy danych", "localhost");
        if(ip != "" && ip != null){
            console.log(ip);
        } else{
            ip = 'localhost';
        }
        $('#ipMongo').html(ip);
        net.setAddress(ip);

    }
    setAddressDiv(res){
        if(res == 'error'){
            net.setAddress('localhost');
        }
        $('#ipMongo').html(res.ip);

        if(res != 'error'){
            console.log(res.dbs);
            $('#dvDataBaseList').empty();
            res.dbs.forEach(db => {
                const dv = $('<div>').html(db.name).addClass('dbEl').appendTo($('#dvDataBaseList'));
                dv.click(() => {
                    const nameDb = dv.html();
                    console.log(nameDb);
                    $('#pThisBase').html(nameDb);
                    net.getCollOfDB(nameDb);
                })
            });
        }
    }

    setCollectionList(colls){
        $('#dvCollectionList').empty();
        colls.forEach(coll => {
            const dv = $('<div>').html(coll.name).addClass('collEl').appendTo($('#dvCollectionList'));
            dv.click(() =>{
                const nameColl = dv.html();
                $('#pThisCollection').html(nameColl);
            })
        })
    }

    addButtons(){
        //dataBases
        $('#btNewDataBase').click(() =>{
            console.log('addDataBase');
            const newBase = prompt('Nazwa Bazy danych', 'nowaBaza');
            if(newBase){
                console.log(newBase);
                net.addDataBase(newBase);
            }
        })

        $('#btRemoveDataBase').click(() =>{
            console.log('removeDataBase');
            const dbName = $('#pThisBase').html();
            console.log(dbName);
            if(dbName != ''){
                net.removeDataBase(dbName);
            }
        })

        //Collections
        $('#btNewCollection').click(() =>{
            console.log('btAddCollection');
            const newColl = prompt('Nazwa Kolekcji', 'nowaKolekcja');
            const dbName = $('#pThisBase').html();
            if(newColl){
                net.addCollection(dbName, newColl);
            }
        })

        $('#btRemoveCollection').click(() =>{
            console.log('Remove Collection');
            const dbName = $('#pThisBase').html();
            const collName = $('#pThisCollection').html();

            if(dbName != '' && collName != ''){
                console.log(dbName, collName);
                net.removeCollection(dbName, collName);
            }
        })
    }

    setDataBases(res){
        if(res != 'error'){
            console.log(res.dbs);
            $('#dvDataBaseList').empty();
            res.dbs.forEach(db => {
                const dv = $('<div>').html(db.name).addClass('dbEl').appendTo($('#dvDataBaseList'));
                dv.click(() => {
                    const nameDb = dv.html();
                    console.log(nameDb);
                    $('#pThisBase').html(nameDb);
                    net.getCollOfDB(nameDb);
                })
            });
        }
    }

}