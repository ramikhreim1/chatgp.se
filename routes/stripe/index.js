const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const stripe = require('../middlewares/stripe');
const checkout = require('./checkout');
const subscription = require('./subscription');
const invoice = require('./invoice');

// Prepare Core Router
let app = express.Router()


// Webhook handler for asynchronous events.
app.post("/webhook", bodyParser.raw({ type: 'application/json' }), async (req, res) => {
	let data;
	let eventType;

	// Check if webhook signing is configured.
	if (process.env.STRIPE_WEBHOOK_SECRET) {
		// Retrieve the event by verifying the signature using the raw body and secret.
		let event;
		// console.log(`req.headers["stripe-signature"]`,req.headers["stripe-signature"])
		let signature = req.headers["stripe-signature"];
		console.log(signature);
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`);
			return res.sendStatus(400);
		}
		// Extract the object from the event.
		data = event.data;
		eventType = event.type;
	} else {
		// Webhook signing is recommended, but if the secret is not configured in `config.js`,
		// retrieve the event data directly from the request body.
		data = req.body.data;
		eventType = req.body.type;

	}

	console.info("event data >>>> ", data.object);
	console.info("event eventType >>>> ", eventType);

	checkout(eventType, data)
	subscription(eventType, data)
	invoice(eventType, data)

	// if (eventType === "checkout.session.completed") {
	// 	console.log(`🔔  Payment received!`);
	// }

	res.sendStatus(200);
});

module.exports = app