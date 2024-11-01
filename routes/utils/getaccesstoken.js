const jwt = require("jsonwebtoken");
const getAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_TIME * 60// 1 = 1 minute
    });
}
module.exports = getAccessToken;