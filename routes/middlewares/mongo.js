// Export mongoose
const mongoose = require("mongoose");
const { v4 } = require("uuid");

require('dotenv-flow').config();

//Assign MongoDB connection string to Uri and declare options settings
var uri = `mongodb+srv://${process.env.MONGO_URL_NAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL_CLUSTER}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
const db = require("../models");
const User = db.user;
db.mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false // Set useFindAndModify option to false
	})
	.then((v) => {
		console.info("database connected")
		initial();
	})
	.catch(err => {
		console.error("Connection error", err);
		process.exit();
	});

function initial() {
	User.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			new User({
				email: "admin@domain.com",
				password: "$2a$08$hVnfdemp6cpovhm0uOvDeOqPcwiO7Ek0SWcGqLwlTTytFRBg7C.TW", // KeepingHumanSafe101
				accountType: "admin",
				fname: "Admin",
				lname: "",
				referralId: v4(),
				accountType: "admin",
				plan: "Ultimate",
				status: "active",
				credits: 10000,
			}).save(err => {
				if (err) {
					console.log("error", err);
				}
				console.log("admin user added");
			});

			new User({
				email: "support@openai.com",
				password: "$2a$08$hVnfdemp6cpovhm0uOvDeOqPcwiO7Ek0SWcGqLwlTTytFRBg7C.TW", // KeepingHumanSafe101
				accountType: "user",
				fname: "OpenAI",
				lname: "Support",
				plan: "Ultimate",
				referralId: v4(),
				status: "active",
				credits: 1000,
			}).save(err => {
				if (err) {
					console.log("error", err);
				}
				console.log("admin user added");
			});

		}
	});
}