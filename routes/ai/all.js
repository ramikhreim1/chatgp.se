const express = require('express');
const tools = require("../utils/chatgpt_prompts.json");
const openai = require('../middlewares/openai');

let app = express.Router();

app.post('/:name', async (req, res, next) => {
    try {
        let { content } = req.body;
        const { name } = req.params;
        const toolFound = tools.find(v => v.cmd === name);

        let prompt = `${toolFound?.prompt || ""}:\n`;

        let inputRaw = `${content}`;
        prompt += inputRaw;

        const completion = await openai.complete({
            model: 'gpt-3.5-turbo-instruct',
            prompt,
            maxTokens: 3000,
            n: 1,
            temperature: 0.5,
            stream: false,
            user: req.user._id,
        });

        let output = `${completion.data.choices[0].text}`;

        if (output.endsWith('"')) {
            output = output.substring(0, output.length - 1);
        }

        if (output.endsWith('"')) {
            output = output.substring(0, output.length - 1);
        }

        if (output.startsWith('\n')) {
            output = output.substring(1, output.length);
        }
        if (output.endsWith('\n')) {
            output = output.substring(0, output.length - 1);
        }

        req.locals.input = prompt;
        req.locals.inputRaw = inputRaw;
        req.locals.output = output;

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate response',
        });
    }
});

module.exports = app;
