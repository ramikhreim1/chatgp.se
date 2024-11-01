const User = require('../models/user')
const CustomError = require('../utils/customError')

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (user && user.accountType === "admin") {
            next()
        } else {
            throw new CustomError("Only admin can access this resource").add({HTTPstatus:403})
        }
    } catch (error) {
        next(error)
    }
}
module.exports = { isAdmin }