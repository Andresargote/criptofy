const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const id = Joi.objectId();
const name = Joi.string();
const red = Joi.string();
const address = Joi.string();

const createCryptoSchema = ({
    name: name.required(),
    red: red.required(),
    address: address.required(),
});

const deleteCryptoSchema = ({
    id: id.required(),
});

const getCryptoSchema = ({
    id: id.required(),
});

module.exports = { createCryptoSchema, deleteCryptoSchema, getCryptoSchema };