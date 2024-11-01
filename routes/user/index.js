const express = require('express');
const stripe = require('../middlewares/stripe')
const db = require("../models");
const User = db.user;
const Feedback = db.feedback;

// Prepare Core Router
let app = express.Router()// User Subscribe

app.post('/stripe/subscribe', async (req, res) => {
	const { priceId, trial, res_url } = req.body;
	try {
		const user = await User.findOne({ _id: req.user._id });
		const customer = user.customerId ? { customer: user.customerId } : { customer_email: user.email };
		const subscription_data = trial ? {
			trial_settings: { end_behavior: { missing_payment_method: 'cancel' } }
		} : {};
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			...customer,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			payment_method_collection: 'if_required',
			subscription_data,
			success_url: `${process.env.DOMAIN}signup/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.DOMAIN}my-profile`,
		});
		if (res_url) {
			return res.json(session.url);
		}
		res.redirect(303, session.url);
	} catch (error) {
		console.error(error);
		res.status(400).send({
			error: {
				message: error.message,
			}
		});
	}
});
app.post('/stripe/buy250', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const customer = user.customerId ? { customer: user.customerId } : { customer_email: user.email };
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			...customer,
			line_items: [
				{
					price: process.env.STRIPE_PRODUCT_250,
					quantity: 1,
				},
			],
			customer_update: { address: "auto" },
			automatic_tax: {
				enabled: true,
			},
			payment_method_collection: 'if_required',
			success_url: `${process.env.DOMAIN}my-profile`,
			cancel_url: `${process.env.DOMAIN}my-profile`,
		});
		res.redirect(303, session.url);
	} catch (error) {
		console.error(error);
		res.status(400).send({
			error: {
				message: error.message,
			}
		});
	}
});

// app.post('/stripe/buy250', async (req, res) => {
// 	try {
// 		const user = await User.findOne({ _id: req.user._id });
// 		const customer = user.customerId ? { customer: user.customerId } : { customer_email: user.email };
// 		const session = await stripe.checkout.sessions.create({
// 			payment_method_types: ['card'],
// 			...customer,
// 			line_items: [
// 				{
// 					price: process.env.STRIPE_PRODUCT_250||"price_1MvRgnK0vBwAJTX5Nnosy94p",
// 					quantity: 1,
// 					adjustable_quantity: {
// 						enabled: true,
// 						maximum: 100,
// 						minimum: 1
// 					}
// 				},
// 			],
// 			customer_update:{address:"auto"},
// 			automatic_tax: {
// 				enabled: true,
// 			  },
// 			mode: 'payment',
// 			success_url: process.env.DOMAIN,
// 			cancel_url: process.env.DOMAIN,
// 			metadata: {
// 				product_name: "buy250",
// 				credits:process.env.STRIPE_PRODUCT_BUY_CREDITS_PER_ONE_DOL
// 			},
// 		});
// 		res.redirect(303, session.url);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(400).send({
// 			error: {
// 				message: error.message,
// 			}
// 		});
// 	}
// });

// Extracted function to generate the returnUrl
function getReturnUrl() {
	const domainURL = process.env.DOMAIN;
	return `${domainURL}my-profile`;
}

// Route to manage billing with the portal
app.post('/stripe/customer-portal', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: user.customerId,
			return_url: getReturnUrl(),
		});
		res.redirect(303, portalSession.url);
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to create portal session');
	}
});

// Route to activate a subscription
app.post('/stripe/activate', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const subscriptions = await stripe.subscriptions.list({
			customer: user.customerId,
			limit: 1,
		});
		await stripe.subscriptions.update(subscriptions.data[0].id, {
			trial_end: 'now',
			cancel_at_period_end: false,
		});
		setTimeout(() => res.redirect(303, getReturnUrl()), 2500);
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to activate subscription');
	}
});

// Route to cancel a subscription
app.post('/stripe/cancel', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const subscriptions = await stripe.subscriptions.list({
			customer: user.customerId,
			limit: 1,
		});
		await stripe.subscriptions.update(subscriptions.data[0].id, {
			cancel_at_period_end: true,
		});
		setTimeout(() => res.redirect(303, getReturnUrl()), 2500);
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to cancel subscription');
	}
});
// Uncancel subscription
app.post('/stripe/uncancel', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const subscriptions = await stripe.subscriptions.list({
			customer: user.customerId,
			limit: 1,
		});
		const subscriptionId = subscriptions.data[0].id;
		await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: false,
		});
		setTimeout(() => res.redirect(303, getReturnUrl()), 2500);
	} catch (err) {
		console.error(err);
		res.redirect(303, getReturnUrl());
	}
});

// Get user's subscription plan information
app.post('/stripe/plan', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const obj = {
			plan: 'None',
			status: 'trailing',
			start_date: '',
			cancel_at_period_end: '',
			current_period_end: '',
		};

		if (user.customerId) {
			const subscriptions = await stripe.subscriptions.list({
				customer: user.customerId,
				limit: 1,
			});

			if (subscriptions.data[0] && subscriptions.data[0].plan?.id !== process.env.STRIPE_PRODUCT_FREE) {
				const subscription = subscriptions.data[0];
				obj.plan = subscription.plan.nickname;
				obj.status = subscription.status;
				obj.start_date = subscription.start_date;
				obj.cancel_at_period_end = subscription.cancel_at_period_end;
				obj.current_period_end = subscription.current_period_end;
			}
		}

		res.json(obj);
	} catch (err) {
		console.error(err);
	}
});

// Refresh user profile
app.post('/refresh/profile', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		const { password, ...profile } = user.toObject();
		res.json({ profile });
	} catch (err) {
		console.error(err);
	}
});

// Submit feedback
app.post('/feedback', async (req, res) => {
	try {
		const { feedback } = req.body;
		const { _id, email } = req.user;
		const newFeedback = new Feedback({
			user: _id,
			feedback,
			email,
		});
		await newFeedback.save();
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.json({ success: false });
	}
});

// Get user's feedback
app.post('/feedback/view', async (req, res) => {
	try {
		const feedbacks = await Feedback.find({ user: req.user._id }).sort({ _id: -1 }).limit(5);
		res.json(feedbacks);
	} catch (err) {
		console.error(err);
		res.json([]);
	}
});




module.exports = app