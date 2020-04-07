const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
var mongo = require('mongodb');
app.use(bodyParser.json());

app.use(cors());
const API_PORT = 8899;

var MongoClient = mongo.MongoClient;
var url = "mongodb://127.0.0.1:27017/fish_data";

MongoClient.connect(url, (err) => {
    if (err) throw err;
    console.log('Connect to database!')
})

app.get('/fish', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        db.collection("FishData").find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
})

app.post('/fish', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var dataUser = req.body
        db.collection("FishData").insertOne(dataUser, (err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
})

app.get('/fish/:fish_id', (req, res) => {
    var theidID = req.params.fish_id
    var o_id = new mongo.ObjectID(theidID);
    MongoClient.connect(url, (err, db) => {
        db.collection("FishData").find({ _id: o_id }).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
})

app.put('/update/:fish_id', (req, res) => {
    let theidID = req.params.fish_id
    var o_id = new mongo.ObjectID(theidID);
    var myquery = { _id: o_id };
    var newvalues = {
        $set: {
            id: req.body.id,
            local_name: req.body.local_name,
            common_name: req.body.common_name,
            scientific_name: req.body.scientific_name,
            image: req.body.image,
            fish_detail: req.body.fish_detail,
        }
    };
    MongoClient.connect(url, (err, db) => {
        db.collection("FishData").update(myquery, newvalues, (err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
})

app.delete('/delete/:fish_id', (req, res) => {
    var theidID = req.params.fish_id
    var o_id = new mongo.ObjectID(theidID);
    var query = { _id: o_id }
    MongoClient.connect(url, (err, db) => {
        db.collection("FishData").deleteOne(query, (err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
})

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));