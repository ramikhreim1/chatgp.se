const db = require('../models');
const jwt = require('jsonwebtoken');
const User = db.user;

// route middleware to verify a token
const verifyToken = async (req, res, next) => {
	const token =  req.cookies.asrtrhnh;
	const accessToken=req.headers["x-access-token"]


	if (token) {
		jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
			if (err) {
				console.log(err);
				res.statusMessage = "Token Authentication Failed";
				res.sendStatus(401)
				return
			} else {
				req.user = decoded;
				next();
			}
		});
	} else {
		res.statusMessage = "Token Authentication Failed";
		res.sendStatus(401)
	}
}

const isAdmin = (req, res, next) => {
	User.findById(req.user._id).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (user.accountType === 'admin') {
			next();
		} else {
			res.status(403).send({ message: 'You are not an admin' });
		}
	});
};

const isLoggedIn = (req, res, next) => {
	try {
		const token = req.cookies.asrtrhnh;
		if (token) {
			jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
				if (err) {
					req.isLoggedIn = false;
				} else {
					req.isLoggedIn = true;
					req.user = decoded;
				}
			});
		} else {
			req.isLoggedIn = false;
		}
		next();
	} catch (err) {
		// Handle any errors that occur within the try block
		// For example, you can send an error response or log the error
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};



const authJwt = {
	isLoggedIn,
	verifyToken,
	isAdmin,
};
module.exports = authJwt;