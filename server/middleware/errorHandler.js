const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    // Don't log full stack for known errors
    if (!err.statusCode) {
        console.error(err.stack);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: 'Validation error', errors: messages });
    }

    // Mongoose cast error (invalid ID)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `${field} already exists` });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please login again' });
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 20MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    // Axios errors (e.g., from Groq API calls)
    if (err.isAxiosError && err.response) {
        const apiError = err.response.data?.error?.message || err.message;
        console.error('External API error:', apiError);
        return res.status(502).json({ message: `AI service error: ${apiError}` });
    }

    // Custom errors with statusCode (from AI service)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal server error',
    });
};

module.exports = errorHandler;
