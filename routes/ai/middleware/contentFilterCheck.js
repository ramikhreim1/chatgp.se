const openai = require('../../middlewares/openai');

const contentFilterCheck = async (req, res, next) => {
	let content = '';

	if (req.locals.outputs) {
		for (let i = 0; i < req.locals.outputs.length; i++) {
			content += req.locals.outputs[i];
		}
		req.locals.outputsString = `${content}`;
	}

	if (req.locals.output) {
		content += req.locals.output;
	}

	if (req.locals.skipFilter || content === '') {
		return next();
	}

	try {
		const moderation = await openai.createModeration({
			model: 'omni-moderation-latest',
			input: content,
		});

		const result = moderation?.data?.results?.[0];
		if (result?.flagged) {
			return res.json({
				success: false,
				error: 'Unsafe content',
				message: 'Unsafe content , please try different language'
			});
		}

		return next();
	} catch (error) {
		return next();
	}
};

module.exports = contentFilterCheck;
