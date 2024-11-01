const express = require('express');
const path = require('path')

const router = express.Router();

router.get("/temp/pdf/:name", async (req, res) => {
    res.sendFile(path.join(__dirname, "../temp", req.params.name))
});
module.exports = router;