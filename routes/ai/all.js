
const express = require('express');
const tools = require("../utils/chatgpt_prompts.json")

////////////
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

///////////

let app = express.Router()

app.post('/:name', async (req, res, next) => {
    try {
        let { content, } = req.body
        const { name } = req.params
        const toolFound = tools.find(v => v.cmd === name)

        let prompt = `${toolFound?.prompt || ""}:\n`

        let inputRaw = `${content}`
        prompt += inputRaw

        console.log(prompt);

        const completion = await openai.createCompletion({
            model: 'gpt-3.5-turbo-0613',
            prompt,
            max_tokens: 3000,
            n: 1,
            stop: null,
            temperature: 0.5,
        })
        console.log(completion.data);
        let output = `${completion.data.choices[0].text}`

        // If the output string ends with one or more hashtags, remove all of them
        if (output.endsWith('"')) {
            output = output.substring(0, output.length - 1)
        }

        // If the output string ends with one or more hashtags, remove all of them
        if (output.endsWith('"')) {
            output = output.substring(0, output.length - 1)
        }

        // remove a single new line at the end of output if there is one
        if (output.startsWith('\n')) {
            output = output.substring(1, output.length)
        }
        // remove a single new line at the end of output if there is one
        if (output.endsWith('\n')) {
            output = output.substring(0, output.length - 1)
        }

        req.locals.input = prompt
        req.locals.inputRaw = inputRaw
        req.locals.output = output

        next()
    } catch (error) {
        console.error(error);
    }


})

module.exports = app


