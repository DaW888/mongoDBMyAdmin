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
                const collName = dv.html();
                const dbName = $('#pThisBase').html();
                $('#pThisCollection').html(collName);
                net.getDataFromColl(dbName, collName);
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

    setDataFromColl(data){
        $('#main').empty();
        // <div class="dataEl">
        //     <textarea cols="70" rows="10" disabled></textarea>
        //     <button class="delDataEl">Delete</button>
        //     <button class="editDataEl">Edit</button>
        // </div>
        data.forEach(el => {
            const stringEl = JSON.stringify(el, null, 2);
            const dv = $('<div>').addClass('dataEl');
            $('<textarea>').attr({name: el._id, disabled: 'disabled', cols: 70, rows: 10}).val(stringEl).appendTo(dv);
            const delDataEl = $('<button>').html('Delete').addClass('delDataEl').attr('data-id', el._id).appendTo(dv);
            const editDataEl = $('<button>').html('Edit').addClass('editDataEl').attr('data-id', el._id).appendTo(dv);
            dv.appendTo($('#main'));

            delDataEl.click((e)=> {
                console.log(e.target.getAttribute('data-id'));
                const idEl = e.target.getAttribute('data-id');
                const dbName = $('#pThisBase').html();
                const collName = $('#pThisCollection').html();
                net.delDataEl(dbName, collName, idEl);
            });

            editDataEl.click((e)=> {
                console.log(e.target.getAttribute('data-id'));
                const idEl = e.target.getAttribute('data-id');
                const dbName = $('#pThisBase').html();
                const collName = $('#pThisCollection').html();
                this.editOneElement(dbName, collName, idEl, stringEl);
            });
        })

        
    }

    editOneElement(dbName, collName, idEl, stringEl){
        $('#main').empty();
        //TODO calosc
        const dv = $('<div>').addClass('dataEl');
        const textArea = $('<textarea>').attr({name: idEl, cols: 70, rows: 40}).val(stringEl).appendTo(dv);
        const setDataEl = $('<button>').html('Set').addClass('delDataEl').attr('data-id', idEl).appendTo(dv);
        dv.appendTo($('#main'));

        setDataEl.click(() => {
            const data = textArea.val();
            try{
                const json = JSON.parse(data);
                console.log(json);

            }catch(e){
                console.log('invalid json');
                alert('INVALID JSON');
            }
        })
    }

}