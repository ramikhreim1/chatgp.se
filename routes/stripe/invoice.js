const models = require("../models");
const sendEmail = require("../utils/sendEmail");
const stripe = require('../middlewares/stripe')
const User = models.user;


const invoice = async (eventType, data) => {

	if (!eventType.includes("invoice")) {
		return // not a subscription event
	}

	paid(eventType, data)
}

const paid = async (eventType, data) => {

	if (!eventType.includes("invoice.paid")) {
		return // not a subscription event
	}
	const { object } = data

	console.log("stripe paid even object", object);

	let user = await User.findOne({
		$or: [
			{ customerId: object.customer },
			{ email: object.customer_email }
		]
	});

	console.log(object.metadata, object.amount_paid);


	// only updating credits when user pay some money
	if (object.amount_paid > 0) {
		if (!user.referrerPaid) { // check for referrer if any then pay referer // only paying when referrer bought any plan
			let referrer = await User.findOne({
				_id: user.referrer
			})
			if (referrer) { // if referrer is available
				referrer.credits += 100 // paying 100 credits to referrer
				user.referrerPaid = true
				referrer.save()
			}
		}// paying referrer done

		// retrieving plan for which the invoice is generated
		const subscription = await stripe.subscriptions.retrieve(
			object.subscription,
			{ expand: ['plan'] }
		);
		const plan = subscription.plan // here we have information of subscription plan

		console.log("user plans>>>>", subscription.plan);

		// previously we have ensured that user has payed so we have to assign credits according to its plan  

		// implementing credits here
		if (plan.id === process.env.STRIPE_PRODUCT_ENTRY) { // cheking if the plan is entry plan then run this block
			user.credits += parseInt(process.env.ENTRY_CREDITS) || 1000  //DEFAULT 1000
			console.log(`Adding entry ${process.env.ENTRY_CREDITS || 1000} credits to ${user.email}`)
		}
		if (plan.id === process.env.STRIPE_PRODUCT_PRO) {// cheking if the plan is pro plan then run this block
			user.credits += parseInt(process.env.PRO_CREDITS) || 1000  //DEFAULT 1000
			console.log(`Adding pro ${process.env.PRO_CREDITS || 1000} credits to ${user.email}`)
		}
		if (plan.id === process.env.STRIPE_PRODUCT_250) {// cheking if the plan is pro plan then run this block
			user.credits += 250  //DEFAULT 250
			console.log(`Adding 250 credits to ${user.email}`)
		}
		if (plan.id === process.env.STRIPE_SPECIAL_UNLIMITED) {// cheking if the plan is pro plan then run this block
			user.credits += 4000
			console.log(`Adding 4000 credits to ${user.email}`)
		}

		// otherwise dont do anything 
		// we have three situation 1. user has free plan 2. user Bought  entry plan 3. user Bought pro plan
		// user has default 100 credits for free trial and that is for once when a user is created
		// and then for every payment we have to give him credits
	}

	try {
		await user.save();
		console.log("Added");
	} catch (error) {
		console.error("error updating user credits: ", error);
	}

}

module.exports = invoice