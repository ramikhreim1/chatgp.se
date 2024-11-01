const validator = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next()
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = validator;