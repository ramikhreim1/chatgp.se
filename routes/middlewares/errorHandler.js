const mongoose = require("mongoose");

// Express error handling middleware
module.exports = ((err, req, res, next) => {
    // Default error status
    let statusCode = 500;

    // Default error message
    let errorMessage = 'Internal Server Error';

    // Check for specific error types and customize the response accordingly
    if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400; // Bad Request
        errorMessage = err.message;
    } else if (err instanceof mongoose.Error.CastError) {
        statusCode = 404; // Not Found
        errorMessage = 'Resource not found';
    } else if (err.name==='CustomError') {
        if(err.HTTPstatus)
            statusCode = err.HTTPstatus; // custom status
        errorMessage = err.message
    }

    // Send the error response
    console.error('Error: ',err.message);
    res.status(statusCode).json({ error: errorMessage });
});
