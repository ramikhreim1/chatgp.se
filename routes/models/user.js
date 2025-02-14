const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const { v4 } = require('uuid');
const { string } = require("../../node_modules/joi/lib/index");

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true,
		maxLength: 100
	},
	verified: {
		type: Boolean,
		default: false
	},
	googleUser: {
		type: Boolean,
		default: false
	},
	googleId: {
		type: String,
	},
	imageUrl: {
		type: String,
		default: ""
	},
	fname: { type: String, default: "", maxLength: 100 },
	lname: { type: String, default: "", maxLength: 100 },
	password: { type: String, default: "", maxLength: 100 },
	accountType: { type: String, default: "user" }, // user, admin
	permissions: { type: [String], default: ["user"] },
	created: { type: Date, default: Date.now },
	customerId: { type: String, default: "" }, // stripe id
	credits: {
		type: Number,
		default: 25,
		integer: true,
		get: v => Math.round(v),
		set: v => Math.round(v),
	},
	creditsUsed: {
		type: Number,
		default: 0,
		integer: true,
		get: v => Math.round(v),
		set: v => Math.round(v),
	},
	plan: { type: String, default: "" }, //free, entry, pro,
	status: { type: String, default: "" }, // trialing, active, inactive
	trial_end: {
		type: Date,
		default: ((Date.now() / 1000) + (7 * 24 * 60 * 60)),
		set: d => new Date(d * 1000)
	},
	current_period_end: {
		type: Date,
		default: ((Date.now() / 1000) + (7 * 24 * 60 * 60)),
		set: d => new Date(d * 1000)
	},
	cancel_at_period_end: { type: Boolean, default: false },
	referralId: {
		type: String,
		unique: true,
		maxLength: 100,
		default: v4(),
	},
	referrerPaid: { type: Boolean, default: false }, // has the referral been given credits yet?
	referrer: {
		type: ObjectId,
		ref: "user",
	},
	resetToken: { type: String },
	resetTokenExpiration: { type: Date }
});
UserSchema.index({ resetTokenExpiration: 1 }, { expireAfterSeconds: 0 });


UserSchema.pre('save', function (next) {
	const now = Date.now();
	if (this.resetTokenExpiration && this.resetTokenExpiration < now) {
		this.resetToken = undefined;
		this.resetTokenExpiration = undefined;
	}
	next();
});

UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.hash_password);
};

const User = mongoose.model('user', UserSchema)
module.exports = User
