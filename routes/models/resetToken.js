const mongoose = require("mongoose");
const Schema = mongoose.Schema

const resetToken = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        maxLength: 100
    },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date }
});
resetToken.index({ resetTokenExpiration: 1 }, { expireAfterSeconds: 0 });


resetToken.pre('save', function (next) {
    const now = Date.now();
    if (this.resetTokenExpiration && this.resetTokenExpiration < now) {
        this.resetToken = undefined;
        this.resetTokenExpiration = undefined;
    }
    next();
});

const ResetToken = mongoose.model('resetToken', resetToken)
module.exports = ResetToken
