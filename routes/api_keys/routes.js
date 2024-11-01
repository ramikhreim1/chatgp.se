const express = require('express');
const router = express.Router();
const APIKey = require('../models/apiKey')
const { v4 } = require('uuid');
const { isAdmin } = require("../middlewares/checkAdmin")


// Get all API keys only admin can get 
router.get('/apikeys', isAdmin, async (req, res, next) => {
    try {
        const apiKeys = await APIKey.find().populate('user', 'name email');
        res.json(apiKeys);
    } catch (error) {
        next(error)
    }
});

// Get API keys by user
router.get('/apikeys/by_user', async (req, res, next) => {
    try {
        const apiKeys = await APIKey.find({ user: req.user["_id"] }).populate('user', 'name email');
        res.json(apiKeys);
    } catch (error) {
        next(error)
    }
});

// Create a new API key
router.post('/apikeys', async (req, res, next) => {
    try {
        const { services } = req.body;


        // Generate a unique API key
        const apiKey = v4();

        // Create the API key document
        const newAPIKey = new APIKey({
            user: req.user._id,
            apiKey: apiKey,
            services: services || []
        });

        // Save the new API key
        const savedAPIKey = await newAPIKey.save();
        res.status(201).json(savedAPIKey);
    } catch (error) {
        next(error)
    }
});

// Delete an API key
router.delete('/apikeys/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the API key exists
        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        // Delete the API key
        await APIKey.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
});

// add an Service
router.post('/apikeys/:id/service', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Check if the API key exists
        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        apiKey.services.push({ name: name });

        // Save the updated API key
        const updatedAPIKey = await apiKey.save();
        res.json(updatedAPIKey);
    } catch (error) {
        next(error)
    }
});
// remove an Service
router.delete('/apikeys/:id/service/:name', async (req, res, next) => {
    try {
        const { id, name } = req.params;

        // Check if the API key exists
        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        apiKey.services = apiKey.services?.filter(service => service.name !== name);

        // Save the updated API key
        const updatedAPIKey = await apiKey.save();
        res.json(updatedAPIKey);
    } catch (error) {
        next(error)
    }
});

// recreate an API key
router.put('/apikeys/recreate/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the API key exists
        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        // Generate a new API key
        const newApiKey = v4();

        // Update the apiKey field with the new key
        apiKey.apiKey = newApiKey;

        // Save the updated API key
        const updatedAPIKey = await apiKey.save();
        res.json(updatedAPIKey);
    } catch (error) {
        next(error)
    }
});


// GET route to fetch the IP whitelist for an API key
router.get('/apikeys/:id/ipwhitelist', async (req, res, next) => {
    try {
        const { id } = req.params;
        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }
        res.json(apiKey.ipWhitelist);
    } catch (error) {
        next(error)
    }
});

router.post('/apikeys/:id/ipwhitelist/current', async (req, res, next) => {
    try {
        const { id } = req.params;
        const clientIP = req.ip;

        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        // Add the client's IP address to the whitelist
        apiKey.ipWhitelist.push(clientIP);

        // Save the updated API key
        const updatedAPIKey = await apiKey.save();

        res.json(updatedAPIKey);
    } catch (error) {
        next(error)
    }
});

router.delete('/apikeys/:id/ipwhitelist/:ip', async (req, res, next) => {
    try {
        const { id, ip } = req.params;

        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        // Add the client's IP address to the whitelist
        apiKey.ipWhitelist = apiKey.ipWhitelist.filter(addedIp => addedIp !== ip);

        // Save the updated API key
        const updatedAPIKey = await apiKey.save();

        res.json(updatedAPIKey);
    } catch (error) {
        next(error)
    }
});

router.get('/apikeys/:id/ipValidating', async (req, res, next) => {
    try {
        const { id } = req.params;

        const apiKey = await APIKey.findOne({ user: req.user["_id"], _id: id });
        if (!apiKey) {
            return res.status(404).json({ error: 'API key not found' });
        }

        apiKey.ipValidating = !apiKey.ipValidating

        await apiKey.save()

        res.json(apiKey.ipValidating)

    } catch (error) {
        next(error)
    }
});


module.exports = router;