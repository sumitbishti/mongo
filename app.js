const express = require('express')
const { connectToDb, getConnection } = require('./db');
const { ObjectId } = require('mongodb');

const app = express()
app.use(express.json())
let db;

//db connection
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => console.log('Server running at port 3000...'))
        db = getConnection()
    }
})

app.get('/', (req, res) => {
    res.json('homepage')
})

app.get('/books', (req, res) => {
    let subs = []
    const booksPerPage = 3;
    let page = req.query.page || 1
    if (page <= 0) page = 1

    db.collection('subscribers')
        .find()
        .sort({ rating: 1 })
        .skip((page - 1) * booksPerPage)
        .limit(booksPerPage)
        .forEach(sub => {
            subs.push(sub)
        })
        .then(() => res.status(200).json(subs))
        .catch(() => res.status(400).json({ err: 'Could not fecth' }))
})

app.get('/books/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ err: 'Invalid object id' })
    }

    db.collection('subscribers').findOne({ _id: new ObjectId(req.params.id) })
        .then((doc) => {
            res.status(200).json(doc)
        })
        .catch(err => res.status(400).json({ err: "could not fetch!!" }))
})

app.post('/books', (req, res) => {
    const sub = req.body;

    db.collection('subscribers').insertOne(sub)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(400).json({ msg: 'could not add doc' })
        })
})

app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ msg: 'Invalid book id!' })
    }

    db.collection('subscribers').deleteOne({ _id: new ObjectId(bookId) })
        .then((resp) => {
            res.status(200).json(resp)
        })
        .catch(err => res.json(400).json({ msg: 'could not delete doc' }))
})

app.patch('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const updates = req.body;

    if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ msg: "Invalid book id!" })
    }

    db.collection('subscribers').updateOne({ _id: new ObjectId(bookId) }, { $set: updates })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(err => res.json({ msg: "could not update" }))
})