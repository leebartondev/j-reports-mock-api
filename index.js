const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Middleware
app.use(bodyParser.json())

// API routes
require('./api/routes.js')(app)

// Server
const PORT = process.env.PORT || 5000
app.listen(PORT)
