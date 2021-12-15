const MongoClient = require("mongodb").MongoClient;

const connectToMongoDB = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, _db) => {
            _db || reject(err);
            _db && resolve(_db.db("pacr-v1"));
            console.log("Connected to database: " + !!_db);
        });
    })
}

module.exports = connectToMongoDB;