const { MongoClient } = require('mongodb')
const res = require('./result.json')

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url)

const run = async () => {
    try {
        await client.connect()

        const mydb = client.db("k6");
        const mycoll = mydb.collection("mycoll");
        const result = await mycoll.insertOne(res);

        console.log("Insertion Successful")
        console.log(result)

    }
    catch (err) {
        console.log(err.message)
    }
}
run()