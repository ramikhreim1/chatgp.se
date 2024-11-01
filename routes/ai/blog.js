const express = require('express');
const openai = require('../middlewares/openai'); // This should be set up to use the current OpenAI SDK

const app = express.Router();

app.post('/blog', async (req, res, next) => {
    try {
        const { content } = req.body;
        const prompt = `This is a Chatbot that writes Swedish content that asked from a user:\n${content}`;

        // Make sure to use the method appropriate for your version of the OpenAI SDK
        const gptResponse = await openai.createCompletion({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 777,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["###", "<|endoftext|>", ],
        });

        let output = gptResponse.data.choices[0].text;
        output = output.trim(); // Optionally trim whitespace at both ends

        // Process the output as needed, then store in req.locals if passing to next middleware
        req.locals = {
            input: prompt,
            inputRaw: content,
            output: output
        };

        next(); // Or directly send response: res.json({ output: output });
    } catch (err) {
        console.error('Error during OpenAI API call:', err);
        res.status(500).send({
            success: false,
            message: 'Error generating content from OpenAI'
        });
    }
});

module.exports = app;
