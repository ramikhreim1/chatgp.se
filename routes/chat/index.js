const db = require("../models")
const Chat = db.chat
const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Create a Multer instance with the configured storage
const upload = multer({ dest: 'temp' });

router.post("/", async (req, res) => {
    const newChat = new Chat({
        user: req.user._id,
        name: req.body.name,
        messages: []
    })

    const chat = await newChat.save()

    return res.json(chat)
})


router.post("/chunk_chat", async (req, res) => {
    try {
        const newChat = new Chat({
            user: req.user._id,
            type: "CHUNK_QUERY",
            name: 'New Chat',
            messages: [{
                "sender": req.user._id,
                "recipient": "GPT",
                "text": `**Chat Prepared for:** \`${req.body.link || req.file?.originalname}\``,
                "timestamp": new Date()
            }, {
                "recipient": req.user._id,
                "sender": "GPT",
                "text": `You can now start chating with the uploaded data`,
                "timestamp": new Date(),
            }]
        })
        const chat = await newChat.save()


        return res.json({ chat })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message })
    }
    finally {

    }
})
router.post("/pdf_chat", upload.single('file'), async (req, res) => {
    let chatId = null
    let tempFilePath = ""
    try {
        const newChat = new Chat({
            user: req.user._id,
            type: "PDF_QUERY",
            name: req.file?.originalname,
            messages: [{
                "sender": req.user._id,
                "recipient": "GPT",
                "text": `**Chat Prepared for:** \`${req.body.link || req.file?.originalname}\``,
                "timestamp": new Date()
            }, {
                "recipient": req.user._id,
                "sender": "GPT",
                "text": `You can now start chatting with the uploaded file **${req.body.link || req.file?.originalname}**. Here are some things to get started with:\n\n1. Ask ChatGP to create a summary of this document.\n2. Ask questions about any specific topics mentioned in the document.`,
                "timestamp": new Date(),
            }]
        })
        const chat = await newChat.save()
        if (chat) chatId = chat._id

        const formData = new FormData();
        console.log(req.body.link);
        tempFilePath = path.join(__dirname, `../../temp/${req.file?.filename}`)
        formData.append("url", req.body.link || `http://localhost:3080/api/file/temp/pdf/${req.file?.filename}`)

        const result = await axios.post(`${process.env.QUERY_PDF_URL}/upload?filename=_${req.user._id}__${chatId}`, formData, {
            headers: {
                ...formData.getHeaders(), // Set the appropriate headers for FormData
                'x-api-key': process.env.QUERY_PDF_KEY
            }
        })
        if (result.data?.error) {
            throw new Error(result.data?.error)
        }

        return res.json({ chat })

    } catch (error) {
        console.log(error);
        if (chatId) {
            axios.post(`${process.env.QUERY_PDF_URL}/delete?filename=${req.user._id}__${chatId}`, {}, {
                headers: {
                    'x-api-key': process.env.QUERY_PDF_KEY
                }
            })
            const chat = await Chat.findOne({
                user: req.user._id,
                _id: chatId,
            })
            chat.remove()
        }
        return res.status(500).json({ success: false, message: error.message })
    }
    finally {
        if (tempFilePath) {
            fs.unlinkSync(tempFilePath)
        }
    }
})

router.get("/", async (req, res) => {
    const chats = await Chat.find({
        user: req.user._id,
    }).sort({ createdAt: -1 })

    return res.json(chats)
})

router.get("/:id", async (req, res) => {
    const chats = await Chat.findOne({
        user: req.user._id,
        _id: req.params.id,
    })
    return res.json(chats)
})
router.patch("/:id", async (req, res) => {
    const chat = await Chat.findOne({
        user: req.user._id,
        _id: req.params.id,
    })
    if (chat) {
        chat.name = req.body.name
        await chat.save()
    }
    return res.json(chat)
})
router.delete("/:id", async (req, res) => {
    const chat = await Chat.findOne({
        user: req.user._id,
        _id: req.params.id,
    })
    if (!chat) return res.status(404).json({ success: false })

    if (chat.type === "PDF_QUERY") axios.post(`${process.env.QUERY_PDF_URL}/delete?filename=${req.user._id}__${chat._id}`, {}, {
        headers: {
            'x-api-key': process.env.QUERY_PDF_KEY
        }
    })

    // remove files from cloudinary
    for (let i = 0; i < chat.messages.length; i++) {
        const message = chat.messages[i];
        for (let j = 0; j < message.images.length; j++) {
            const image = message.images?.[j];
            console.log("destroying image from cloudinary: ", image.public_id);
            if (image?.public_id)
                cloudinary.uploader.destroy(image.public_id, function (error, result) {
                    console.log(error);
                    console.log(result);
                });
        }
    }

    chat.remove()
    return res.json({
        success: true,
        message: "chatdeleted"
    })
})
router.delete("/-r/all", async (req, res) => {
    const chats = Chat.find({ user: req.user._id })
    for (let k = 0; k < chats.length; k++) {
        const chat = chats[k];
        for (let i = 0; i < chat.messages.length; i++) {
            const message = chat.messages[i];
            for (let j = 0; j < message.images.length; j++) {
                const image = message.images[j];
                console.log("destroying image from cloudinary: ", image?.public_id);
                if (image?.public_id)
                    cloudinary.uploader.destroy(image.public_id, function (error, result) {
                        console.log(error);
                        console.log(result);
                    });
            }
        }
    }

    Chat.deleteMany({
        user: req.user._id
    })
    return res.json({
        success: true,
        message: "chatdeleted"
    })
})


module.exports = router