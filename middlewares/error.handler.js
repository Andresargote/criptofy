const logger = require('../utils/logger');

function logErrors(err, req, res, next) {
    logger.error(err);
    next(err);
}

function errorHandler(err, req, res, next) {
    if (err.status === 413) {
        res.status(413).json({
            message: 'File too large',
            status: err.status,
        });
    }

    res.status(500).json({
        message: err.message,
        status: 500
    });
}

function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}

module.exports = { logErrors, errorHandler, boomErrorHandler }