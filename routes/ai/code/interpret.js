const express = require('express');

const openai = require("../../middlewares/openai");

let app = express.Router()

app.post('/code/interpret', async (req, res, next) => {

	try {
		let { content, } = req.body

		let prompt = `### Interpret code blocks and explain what they do in simple. helpful terms\n\n` +
			`# Code\n` +
			`function HelloWorld(text){ echo text || "Hello World"; }\n` +
			`# Explanation of what the code does\n` +
			"1. It defines a new function called `HelloWorld` that takes a single argument called `text`\n2. The body of the function prints out the value of `text` if it is defined, or `Hello World` if it is not defined\n\n"

		let inputRaw = `# Code\n` +
			`${content}\n` +
			`# Explanation of what the code does\n1.`

		prompt += inputRaw

		const gptResponse = await openai.complete({
			model: 'gpt-4o-mini',
			prompt,
			maxTokens: 3000,
			n: 1,
			stop: null,
			temperature: 0.5,
		})

		// let output = `${gptResponse.data.choices[0].text}`

		let outputs = []

		if (gptResponse.data.choices[0].text) {
			// Split break lines
			outputs = `1.${gptResponse.data.choices[0].text}`.split('\n')

			// remove entries with spaces or empty
			outputs = outputs.filter(function (output) {
				return (!(output === "" || output === " " || output === "\n"))
			})

			// remove numbers and spaces
			for (let i = 0; i < outputs.length; i++) {
				outputs[i] = outputs[i].substring(3)
				outputs[i] = outputs[i].replace(/^\s+|\s+$/g, '')
			}
			// remove duplicates
			outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)
		}

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.outputs = outputs

		next();

	} catch (err) {
		console.log("err.message", err.message)
	}

})

module.exports = app
