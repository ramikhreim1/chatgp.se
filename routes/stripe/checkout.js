const models = require("../models")
const User = models.user;

const checkout = async (eventType, data) => {

	if (!eventType.includes("checkout")) {
		return // not a subscription event
	}

	console.log("checkout event detected", eventType)

	complete(eventType, data)
	// updated(reqBody)
	// deleted(reqBody)

}

const complete = async (eventType, data) => {

	if (!eventType.includes("checkout.session.completed")) {
		return // not a checkout event
	}
	const { object } = data
	console.log(`object`, object)
	console.log(`object.customer`, object.customer)
	console.log(`object.customer_email`, object.customer_email)
	const cred = object.metadata.credits || 100 // default per one dolar
	const cresitsToGiveperOnecent = cred / 100
	console.log(object.amount_subtotal, "object.amount");
	if (object.metadata?.product_name === 'buy250')
		addCredits({
			credits: Math.floor(cresitsToGiveperOnecent * object.amount_subtotal), customer: object.customer
		})

}

const addCredits = async ({ credits = 250, customer }) => {
	try {
		const user = await User.findOne({ customerId: customer })
		if (user) {
			user.credits += parseInt(credits)
		}
		user.save()
	} catch (error) {
		console.error(error);
	}
}

module.exports = checkout