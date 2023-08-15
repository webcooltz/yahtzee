const dotenv = require("dotenv");
dotenv.config();
// const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log("Db is already initialized!");
        return callback(null, _db);
    }
    /*** MONGO DB CONNECTION ***/

    // MongoClient.connect(process.env.CONNECTION_STRING)
    //     .then((client) => {
    //         _db = client;
    //         callback(null, _db);
    //     })
    //     .catch((err) => {
    //         callback(err);
    //     });

    /*** MONGOOSE CONNECTION ***/

    mongoose.set("strictQuery", false);
    mongoose.set("sanitizeFilter", true);
    mongoose
        .connect(process.env.CONNECTION_STRING)
        .then(() => {
            _db = mongoose.connection;
            callback(null, _db);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw Error("Db not initialized");
    }
    return _db;
};

module.exports = {
    initDb,
    getDb,
};