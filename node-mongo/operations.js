// Insert, find, remove and update a document in my database

const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.insert(document, (err, result) => {
        assert.equal(err, null);
        console.log(`Inserted ${result.result.n} documents into the collection ${collection}`);
        
        // return callback to calling function
        callback(result);
    });
};

exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    
    // findAll using empty {}
    coll.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        
        // return callback to calling function        
        callback(docs);
    });
};

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        console.log(`Removed the document ${document}`);

        // return callback to calling function        
        callback(result);    
    });
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);

    // second param is the field that needs to be updated
    coll.updateOne(document, { $set: update }, null, (err, result) => {
        assert.equal(err, null);
        console.log(`Updated the document with ${update}`);   
        
        // return callback to calling function
        callback(result);
    });
};
