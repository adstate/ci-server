module.exports = (err, req, res) => {
    const {
        statusCode = 500,
        message = 'Internal server error',
    } = err;

    console.error(err);

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
