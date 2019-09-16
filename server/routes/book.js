const router = require('express').Router()
const { Book } = require('./../models/book')

// GET //
router.get('/', (req,res) => {
    
    let id = req.query.id

    Book.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).send(doc)
    })
})

router.get('/all', (req, res) => {

    const skip = parseInt(req.query.skip)
    const limit = parseInt(req.query.limit)
    const order = req.query.order

    Book.find().skip(skip).sort({_id:order}).limit(limit).exec((err, doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).send(doc)
    })
})

// POST //

router.post('/book', (req, res)=> {
    
    const book = new Book(req.body)

    book.save((err, doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({
            post: true,
            bookId: doc._id
        })
    })

})

// UPDATE //

router.post('/update', (req,res) => {

    const id = req.body._id
    const doc = req.body

    Book.findByIdAndUpdate(id, doc, { new: true, useFindAndModify: false }, (err, doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({
            success: true,
            doc
        })
    })
})

// DELETE //

router.delete('/delete', (req,res) => {

    const id = req.query.id

    Book.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({
            success: true
        })
    })
    
})

module.exports = router