const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    
    assert.equal(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection('dishes');

    collection.insertOne(
        {
            "name": "Uthappizza", 
            "description": "testPizza"
        }, 
        (err, result) => {
            assert.equal(err, null);

            console.log('After Insert:\n');
            console.log(result.ops);

            // search for everything in the collection
            collection.find({}).toArray((err, docs) => {
                assert.equal(err, null);

                console.log('Found:\n');
                console.log(docs);

                // remove dishes database
                db.dropCollection('dishes', (err, result) => {
                    assert.equal(err, null);

                    client.close();
                });
            });
        }
    );
});