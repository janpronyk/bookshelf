const router = require('express').Router()
const { User } = require('./../models/user')
const { Book } = require('./../models/book')
const {auth} = require('./../middleware/auth')


const handleError = (res, err, message) => {
    res.status(400).json({
        success: false,
        message,
        err
    })
}

// GET //
router.get('/', auth, (req, res) => {
    const { _id, email, name, lastname } = req.user
    res.json({
        success:true,
        isAuth: true,
        _id,
        email,
        name,
        lastname
    })
})

router.get('/logout', auth, (req,res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if(err) return res.status(400).send(err)
        res.status(200).clearCookie('auth').json({
            success: true,
            user: req.user
        })

    })
    
})


router.get('/reviewer', (req,res) => {

    const { id } = req.query

    console.log('id', req.query);
    

    User.findById(id, (err, doc) => {

        if(err) return handleError(res, err, 'User not found')

        const { name, lastname } = doc

        res.status(200).json({
            name,
            lastname
        })

    })
})

router.get('/all', (req, res) => {

    User.find({}, (err, users) => {
        if(err) return rhandleError(res, err, 'Users not found')

        res.status(200).json({
            success: true,
            users
        })
    })
})

router.get('/user/posts', (req, res) => {

    const { ownerId } = req.query

    Book.find( {ownerId}).exec((err, docs) => {
        if(err) return handleError(res, err, 'User has no posts.')

        res.status(200).json({
            success: true,
            posts: docs
        })
    })

})

// POST //

router.post('/register', (req,res) => {
    const user = new User(req.body)

    user.save((err, doc) => {

        if(err) return rhandleError(res, err, 'User not found')
        
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