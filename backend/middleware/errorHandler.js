const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // JSON parse error
        statusCode = 400;
        message = 'Invalid JSON in request body';
    }

    res.status(statusCode).json({
        error: 'Internal Server Error',
        message: message
    });
};

export default errorHandler;