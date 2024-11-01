const mongoose = require('mongoose');

const Post = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  name:{ type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
});

const PostSchema = mongoose.model('post', Post);

module.exports= PostSchema;