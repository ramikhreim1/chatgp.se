
const sendResponse = async (req, res, next) => {

	// if both req.locals.output is null and req.locals.outputs is null, then
	// the middleware has not been executed
	if (req.locals.images) {
		return res.json({
			success: true,
			photo: req.locals.images.b64_json
		})
	}
	if (!req.locals.output && !req.locals.outputs && !req.locals.images?.length) {
		res.json({
			success: false,
			error: "No Content",
			message: "No Content was generated, please try again"
		})
		return
	}

	let response = { success: true, }
	if (req.locals.output) {
		response.output = req.locals.output
	}
	if (req.locals.outputs) {
		response.outputs = req.locals.outputs
	}
	if (req.locals.code) {
		response.code = req.locals.code
	}
	if (req.locals.images) {
		response.code = req.locals.images
	}

	res.json(response)

}

module.exports = sendResponse