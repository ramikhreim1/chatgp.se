
const express = require('express');
const {
	initMiddleware,
	creditCheck,
	contentFilterCheck,
	sendResponse,
	creditPayment,

	saveToHistory,
} = require('./middleware');

let app = express.Router()

app.use('/', initMiddleware, creditCheck);
app.use('/', require('./chat_gpt'));
app.use('/v2', require('./chat_gpt_v2'));
app.use('/', require('./dalle'));
app.use('/', require('./summarize'));
app.use('/', require('./code/interpret'));
app.use('/', require('./writing/intro'));
app.use('/', require('./jobad'));
app.use('/', require('./codex'));
app.use('/', require('./blog'));
app.use('/', require('./helloworld'));
app.use('/', require('./example'));
app.use('/', require('./sql'));
app.use('/', require('./emailGenerator'));
app.use('/all/', require("./all"));

app.use(contentFilterCheck);
app.use(creditPayment);
app.use(saveToHistory);

app.use(sendResponse);

module.exports = app