
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/business/email_from_url',require("./middleware/generateEmailPrompt"), async (req, res, next) => {
    try {
        console.log(req.body,req.prompt);
        const gptResponse = await openai.complete({
            model: 'gpt-4o-mini',
            prompt: req.prompt,
            maxTokens: 777,
            temperature: 0,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
            bestOf: 1,
            n: 1,
            user: req.user._id,
            stream: false,
            stop: ["###", "<|endoftext|>",],
        });

        let output = `${gptResponse.data.choices[0].text}`

        // remove the first character from output
        output = output.substring(1, output.length)

        // If the output string ends with one or more hashtags, remove all of them
        if (output.endsWith('"')) {
            output = output.substring(0, output.length - 1)
        }

        // If the output string ends with one or more hashtags, remove all of them
        if (output.endsWith('"')) {
            output = output.substring(0, output.length - 1)
        }

        // remove a single new line at the end of output if there is one
        if (output.endsWith('\n')) {
            output = output.substring(0, output.length - 1)
        }

        req.locals.input = req.prompt
        req.locals.inputRaw = req.body.url
        req.locals.output = output

        next()

    } catch (err) {
        console.log(err.response)
        console.log(err.data)
        console.log(err.message)
    }

})

module.exports = app
