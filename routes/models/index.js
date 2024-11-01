const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user");
db.feedback = require("./feedback");
db.history = require("./history");
db.tool = require("./tool");
db.post = require("./post");
db.resetToken = require("./resetToken");
db.chat = require("./chat");
db.APIkey = require("./apiKey");


module.exports = db;