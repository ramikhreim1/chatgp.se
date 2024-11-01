const db = require("../models");
const User = db.user;
const ResetToken = db.resetToken;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const stripe = require("../middlewares/stripe")
const express = require('express');
const { v4 } = require("uuid");
const { resetPasswordSchema, createUserSchema } = require("../utils/schemas");

const passport = require("passport");
const sendEmail = require("../utils/sendEmail");
const handleTokens = require("../utils/handleTokens");
const getAccessToken = require("../utils/getaccesstoken");
const { generateOTP } = require("../utils/helper");
require("./passportgoogleConfig")(passport);
const validator = require("../middlewares/validator")

// Prepare Core Router
let app = express.Router()


const checkDuplicateUsernameOrEmail = async (req, res, next) => {
	try {
		const user = await User.findOne({
			email: req.body.email
		})
		if (user) throw new Error("Failed! Email is already in use!");
		next();
	} catch (error) {
		res.status(400).json({
			message: error.message
		});
	}
};

const signup = async (req, res) => {
	const customer = await stripe.customers.create({
		email: `${req.body.email}`,
		name: `${req.body.fname} ${req.body.lname}`
	});

	let referrerObj = {}
	// console.log(`req.body`, req.body)
	if (req.body.referral) {
		let referrer = await User.findOne({
			referralId: `${req.body.referral}`
		});
		console.log(`referrer._id`, referrer)
		if (referrer) {
			referrerObj = {
				referrer: referrer._id
			}
		}
	}

	console.log(`referrerObj`, referrerObj)

	await User.create({
		email: req.body.email,
		fname: req.body.fname,
		lname: req.body.lname,
		customerId: customer.id,
		referralId: v4(),
		password: bcrypt.hashSync(req.body.password, 8),
		...referrerObj
	});
	// signin(req, res);
	res.statusMessage = "Email sent";
	res.sendStatus(200)
	return

};

const signin = async (req, res) => {
	console.log(req.body.email);

	// Check if req.body.email is a valid email address
	if (!req.body.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(req.body.email)) {
		return res.status(400).json({
			message: "Please enter a valid email address"
		});
	}

	// Check if req.body.password is at least 6 characters long
	if (!req.body.password || req.body.password.length < 6) {
		return res.status(400).json({
			message: "Password must be at least 6 characters long"
		});
	}

	User.findOne({
		email: req.body.email,
	})
		.populate("roles", "-__v")
		.exec((err, user) => {
			if (err) {
				res.status(500).json({ message: err });
				return;
			}

			if (!user) {
				return res.status(404).json({ message: "User Not found." });
			}
			if (!user.verified) {
				res.statusMessage = "!verified";

				res.status(400).json({
					code: "unVerified",
					message: "Account not verified"
				})
				return;
			}

			var passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					token: null,
					message: "Invalid Password!"
				});
			}

			const userToken = {
				_id: user._id,
				email: user.email,
				customerId: user.customerId,
				accountType: user.accountType
			}

			const accessToken = handleTokens(req, res, userToken)

			let profile = {
				...user.toObject()
			}
			delete profile.password
			res.status(200).json({
				token: accessToken,
				profile
			});
		});
};

const resetPassword = async (req, res) => {
	try {
		const value = await resetPasswordSchema.validateAsync(req.body, { abortEarly: false });
		const user = await User.findOne({
			email: value.email,
		})
		if (!user) return res.status(400).json({ message: "invalid credentials" })
		if (!bcrypt.compareSync(
			value.password,
			user.password
		)) return res.status(400).json({ message: "invalid credentials" })

		user.password = bcrypt.hashSync(value.newPassword, 8)
		user.save()

		res.json(user)

	}
	catch (err) {
		console.error(err.details[0]?.message);
		res.status(500).json({
			success: false,
			message: err.details[0]?.message
		})
	}
}
const refresh = async (req, res) => {
	const refreshToken = req.cookies.asrtrhnh
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
		if (err) {
			res.statusMessage = "Token Authentication Failed";
			res.sendStatus(401)
		} else {
			User.findOne({
				_id: decoded._id
			})
				.populate("roles", "-__v")
				.exec((err, user) => {
					if (err) {
						res.statusMessage = "Token Authentication Failed";
						res.sendStatus(401)
					} else {
						const userToken = {
							_id: user._id,
							email: user.email,
							customerId: user.customerId,
							accountType: user.accountType
						}
						var accessToken = getAccessToken(userToken)
						return res.send(accessToken)
					}
				})
		}
	});
}
const forgotPassword = async (req, res) => {
	User.findOne({
		email: req.body.email
	}).then(async (user) => {
		if (!user) {
			return res.status(404).json({
				error: {
					message: "user not found"
				}
			})
		}
		try {
			const token = generateOTP()
			const rtoken = await ResetToken.findOne({
				email: req.body.email
			})
			if (rtoken) {
				rtoken.resetToken = token
				rtoken.resetTokenExpiration = Date.now() + 60 * 1000
			} else {
				await (new ResetToken({
					email: req.body.email,
					resetToken: token,
					resetTokenExpiration: Date.now() + 60 * 1000
				})).save();
			}

			await sendEmail({
				to: user.email,
				subject: 'Reset password',
				template: 'resetToken', // the name of the template file i.e email.handlebars
				context: {
					name: user.fname + " " + user.lname,
					OTP: token,
					our_contact_information: process.env.OUR_CONTACT_INFO_FOR_RESET_PASSWORD,
					our_name: process.env.EMAIL_NAME,
				}
			})
			res.json({
				message: "OTP sent"
			})
		} catch (error) {
			console.error(error);
			res.status(500).json({
				error: {
					message: "something went wrong"
				}
			})
		}
	}).catch(err => {
		res.status(500).json({
			error: {
				message: err.message
			}
		})
	})
}
const changePassword = async (req, res) => {
	ResetToken.findOne({
		email: req.body.email,
		resetToken: req.body.resetToken
	}).then(async (token) => {
		try {
			if (!token) return res.status(404).json({
				error: {
					message: "Invalid"
				}
			})
			const user = await User.findOne({
				email: req.body.email
			})


			user.password = bcrypt.hashSync(req.body.password, 8);
			await user.save()
			res.json({
				message: "Password changed"
			})
		} catch (error) {
			res.status(400).json({
				error: {
					message: "Password not Changed"
				}
			})
		}
	}).catch(err => {
		res.status(404).json({
			error: {
				message: "Invalid"
			}
		})
	})

}

app.post('/contact/send', async (req, res) => {
	try {
		console.log(req.body);
		await sendEmail({
			to: process.env.CONTACT_FORM_RECIEVER,
			subject: 'Contact',
			template: 'contactEmail', // the name of the template file i.e email.handlebars
			context: {
				recieverName: process.env.CONTACT_RECIEVER_NAME,
				name: req.body.name,
				message: req.body.message,
				email: req.body.email,
			}
		})

		res.send("done")

	} catch (err) {
		console.log(err)
		res.status(500).send("error")
	}
})
const confirmEmail = async (req, res) => {
	User.findOne({
		email: req.body.email
	}).then(async (user) => {
		if (!user) {
			return res.status(404).json({
				error: {
					message: "user not found"
				}
			})
		}
		try {
			const token = generateOTP()
			const rtoken = await ResetToken.findOne({
				email: req.body.email
			})
			if (rtoken) {
				rtoken.resetToken = token
				rtoken.resetTokenExpiration = Date.now() + 60 * 1000
			} else {
				await (new ResetToken({
					email: req.body.email,
					resetToken: token,
					resetTokenExpiration: Date.now() + 60 * 1000
				})).save();
			}
			await sendEmail({
				to: user.email,
				subject: 'Email confirmation',
				template: 'resetToken', // the name of the template file i.e email.handlebars
				context: {
					name: user.fname + " " + user.lname,
					OTP: token,
					our_contact_information: process.env.OUR_CONTACT_INFO_FOR_RESET_PASSWORD,
					our_name: process.env.EMAIL_NAME,
				}
			})
			res.json({
				message: "OTP sent"
			})
		} catch (error) {
			console.error(error);
			res.status(500).json({
				error: {
					message: "something went wrong"
				}
			})
		}
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: {
				message: err.message
			}
		})
	})
}
const confirm = async (req, res) => {
	ResetToken.findOne({
		email: req.body.email,
		resetToken: req.body.resetToken
	}).then(async (token) => {
		try {
			if (!token) return res.status(404).json({
				error: {
					message: "Invalid"
				}
			})
			const user = await User.findOne({
				email: req.body.email
			})
			user.verified = true;
			await user.save()
			signin(req, res);
		} catch (error) {
			res.status(400).json({
				error: {
					message: "email not verfied"
				}
			})
		}
	}).catch(err => {
		console.log(err);
		res.status(404).json({
			error: {
				message: "Invalid"
			}
		})
	})
}
app.post("/signup", validator(createUserSchema), checkDuplicateUsernameOrEmail, signup)
app.post("/signin", signin);
app.post("/reset/password", resetPassword);
app.post("/forgotPassword", forgotPassword);
app.post("/confirm-email", confirmEmail);
app.post("/confirm", confirm);
app.post("/changePassword", changePassword);
app.use("/google", require("./google"));
app.get("/refresh", refresh);
app.get("/logout", (req, res) => res.clearCookie('asrtrhnh').send("logged out"));

module.exports = app