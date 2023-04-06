require('dotenv').config()
const { MongoClient } = require('mongodb')

let db;

const connectToDb = (cb) => {
    // const uri = "mongo://localhost:27017/bookstore"
    const uri = process.env.MONGO_URI
    MongoClient.connect(uri)
        .then((client) => {
            db = client.db()
            return cb()
        })
        .catch((err) => {
            console.log(err)
            return cb(err)
        })
}

const getConnection = () => {
    return db;
}

module.exports = {
    connectToDb,
    getConnection
}