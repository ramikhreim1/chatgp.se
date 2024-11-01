const express = require('express');
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 200 // maximum of 200 requests per windowMs
});

let app = express.Router()

const authJwt = require("./auth/authJwt");
const errorHandler = require('./middlewares/errorHandler');

// Webhooks and things
app.use('/stripe', require('./stripe'))

app.use("/", apiLimiter);

// Signup and Authentication
app.use('/auth', require('./auth'))
app.use('/post', require('./post'))
app.use('/file', require('./file'))

// Everything after this requires user authentication
app.use('/', authJwt.verifyToken);

// api_key routes
app.use('/key', require('./api_keys/routes'))

// Already signed up user routes
app.use('/user', require('./user'))

// post route

app.use('/chat', require('./chat'))
app.get('/tools', (req, res) => {
	res.sendFile(__dirname + "/utils/chatgpt_prompts.json")
})

// Using AI Platform
app.use('/ai', require('./ai'))

app.use(errorHandler)

module.exports = app