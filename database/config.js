const mongoose = require('mongoose');
const { config } = require('../config/config');
const logger = require('../utils/logger');

const dbConnection = async () => {
    try {
        mongoose.connect(config.mongodbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('DB is connected');
    } catch (err) {
        logger.error('Error connecting to DB', err);
        throw new Error('Error connecting to DB', err);
    }
}

module.exports = {
    dbConnection
};