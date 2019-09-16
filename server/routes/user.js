const router = require('express').Router()
const { User } = require('./../models/user')


// GET //
router.get('/getReviewer', (req,res) => {

    const { id } = req.query

    console.log('id', req.query);
    

    User.findById(id, (err, doc) => {

        if(err) return send.status(400).send(err)

        const { name, lastname } = doc

        res.status(200).json({
            name,
            lastname
        })

    })
})

router.get('/all', (req, res) => {

    User.find({}, (err, users) => {
        if(err) return send.status(400).send(err)

        res.status(200).json({
            success: true,
            users
        })
    })
})

// POST //

router.post('/register', (req,res) => {
    const user = new User(req.body)

    user.save((err, doc) => {

        if(err) return res.status(400).json({ success: false })
        
        res.status(200).json({ 
            success: true, 
            user: doc 
        })
    })
})

router.post('/login', (req,res) => {

    const { email, password } = req.body

    User.findOne({ email }, (err, user) => {

        if(!user) return res.json({ isAuth: false, message: 'Auth failed, email not found.' })

        user.comparePassword(password, (err, isMatch) => {
            
            if(!isMatch) return res.json({ isAuth: false, message: 'Wrong password'})

            user.generateToken((err, user) => {
                
                const { token, _id, email } = user

                if(err) return send.status(400).send(err)

                res.cookie('auth', token ).json({
                    isAuth: true,
                    _id,
                    email                    
                })
            })
        })
    })
})


module.exports = router