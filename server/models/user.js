const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('./../config/config').get(process.env.NODE_ENV)

const SALT_I = 10


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        maxlength: 100
    },
    lastname: {
        type: String,
        maxlength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
})

// Hooks
userSchema.pre('save', function(next) {
    
    let user = this

    if(user.isModified('password')) {

        bcrypt.genSalt(SALT_I, function(err, salt) {
            
            if(err) return next(err)
            
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })

    } else {

        next()

    }
})

// Methods
userSchema.methods.comparePassword = function(candidatePassword, cb) {

    const user = this

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        
        if(err) return cb(err)
        console.log('isMatch', isMatch)
        cb(null, isMatch)
         
    })
}

userSchema.methods.generateToken = function(cb) {

    let user = this
    const { _id } = user
    const { SECRET } = config

    let token = jwt.sign(_id.toHexString(), SECRET )

    user.token = token

    user.save(function(err, user) {

        if(err) return cb(err)
        cb(null, user)
        
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }