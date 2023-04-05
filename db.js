const { MongoClient } = require('mongodb')

let db;

const connectToDb = (cb) => {
    // const uri = "mongo://localhost:27017/bookstoref"
    const uri = "mongodb+srv://sumit:zxcmnb@cluster0.j2fvghc.mongodb.net/?retryWrites=true&w=majority"
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