const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const db = require("../models");
const authJwt = require('../auth/authJwt');
const User = db.user;
const Post = db.post;


const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
    }
});

router.post("/",authJwt.verifyToken, async (req, res) => {
    try {
        const { prompt, photo } = req.body;
        const user = await User.findOne({
            _id: req.user._id
        })

        const photoUrl = await cloudinary.uploader.upload(photo);

        const newPost = await Post.create({
            userId: req.user._id,
            name: user.fname + " " + user.lname,
            prompt,
            photo: photoUrl.secure_url,
        });
        res.status(200).json({ success: true, data: newPost });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
    }
});
module.exports = router;