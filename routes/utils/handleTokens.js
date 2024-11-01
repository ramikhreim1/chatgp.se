const jwt = require("jsonwebtoken");
const getAccessToken = require("./getaccesstoken");
const handleTokens = (req, res, userToken) => {
    var accessToken = getAccessToken(userToken)
    var refrshToken = jwt.sign(userToken, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 60 * 60 * process.env.REFRESH_TOKEN_TIME
    });
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + process.env.REFRESH_TOKEN_COOKIE_TIME);
    var cookieOptions = {
        httpOnly: true,
        expires: expirationDate
    };

    res.cookie("asrtrhnh", refrshToken, cookieOptions)
    return accessToken
}
module.exports = handleTokens