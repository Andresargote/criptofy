const boom = require('@hapi/boom');
const { config } = require('../config/config');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function checkJWT(req, res, next) {
    //X-TOKEN headers
    const token = req.header('x-auth-token');

    if (!token) {
        logger.error('[auth] No token provided!');
        next(boom.forbidden('No token provided!'));
    }

    try {
        const payload = jwt.verify(token, config.SECRET_KEY);
        req.user = payload;

        next();
    } catch (err) {
        logger.error(`[auth] ${err}`);
        throw boom.unauthorized();
    }
};


module.exports = { checkJWT };