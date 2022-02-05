const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const id = Joi.objectId();
const email = Joi.string().email();
const password = Joi.string().min(8);
const username = Joi.string().alphanum().max(30);
const description = Joi.string().max(160);
const instagram = Joi.string();
const twitter = Joi.string();
const tiktok = Joi.string();
const telegram = Joi.string();

const createUserSchema = Joi.object({
    email: email.required(),
    password: password.required(),
    username: username.required(),
});

const updateUserSchema = Joi.object({
    description: description,
    instagram: instagram,
    twitter: twitter,
    tiktok: tiktok,
    telegram: telegram
});

const updateUsernameSchema = Joi.object({
    username: username.required()
});

const getUserSchema = Joi.object({
    id: id.required(),
});

const idSchema = Joi.object({
    id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, updateUsernameSchema, getUserSchema, idSchema };

