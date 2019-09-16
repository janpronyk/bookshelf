const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

// Server
const config = require('./config/config').get(process.env.NODE_ENV)
const app = express()

// Database
mongoose.Promise = global.Promise
mongoose.connect(config.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })

// Middleware
app.use(bodyParser.json())
app.use(cookieParser())





const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
    
})