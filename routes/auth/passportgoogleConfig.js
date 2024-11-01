const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");
const stripe = require("../middlewares/stripe");
const { v4 } = require("uuid");


module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}api/auth/google/callback`,
        passReqToCallback: true
    },
        async (request, accessToken, refreshToken, profile, done) => {
            console.log("profile", profile);
            try {
                let existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                existingUser = await User.findOne({ email: profile.email });
                if (existingUser) {
                    return done(new Error("Duplicate user is available with username and password"), null);
                }
                console.log('Creating new user...');


                const customer = await stripe.customers.create({
                    email: `${profile.email}`,
                    name: profile.displayName
                });

                let referrerObj = {}

                if (request.query.state) {
                    let referrer = await User.findOne({
                        referralId: `${request.query.state}`
                    });
                    if (referrer) {
                        referrerObj = {
                            referrer: referrer._id
                        }
                    }
                }

                console.log("referrer : ", referrerObj);

                const newUser = new User({
                    email: profile.email,
                    fname: profile.name.givenName,
                    lname: profile.name.familyName,
                    customerId: customer.id,
                    googleUser: true,
                    googleId: profile.id,
                    imageUrl: profile.picture,
                    password: "google_user",
                    referralId: v4(),
                    ...referrerObj
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, false)
            }
        }
    ));
}