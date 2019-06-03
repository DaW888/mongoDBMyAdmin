module.exports = {
     //insert
     Insert: function (collection, data) {
         console.log(data.login, data.pass);
        collection.insert(data, function (err, result) {
            console.log(result);
        });
    },

    //select all - zwraca tablicę pasujących dokumentów
    SelectAll: function (collection, call) {
        collection.find({}).toArray(function (err, items) {
            console.log(items);
            call(items);
        });
    },

    //select - zwraca tablicę pasujących dokumentów, z ograniczeniem
    SelectAndLimit: function (collection) {
        collection.find({login: "test"}).toArray(function (err, items) {
            console.log(items)
        });
    },

    //delete - usunięcie poprzez id - uwaga na ObjectID
    DeleteById: function (ObjectID, collection, id) {
        console.log(id);
        collection.remove({ _id: ObjectID(id) }, function (err, data) {
            // console.log(data);
        })
    },

    // update - aktualizacja poprzez id - uwaga na ObjectID - to funkcja, a nie string
    // uwaga: bez $set usuwa poprzedni obiekt i wstawia nowy
    // z $set - dokonuje aktualizacji tylko wybranego pola

    UpdateById: function (ObjectID, collection, data){
        collection.updateOne(
            { _id: ObjectID(data.id) },
            { $set: { pass: data.pass } },
            function (err, data) {
                console.log("update: "+data)
            })
    },
}