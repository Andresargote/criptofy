const { config } = require('../config/config');
const crypto = require('crypto');

const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const UserModel = require('../database/models/user.model');

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    region: config.S3_REGION
});



class UserService {
    constructor() { }

    async getAll(limit) {
        const users = await UserModel.find()
            .limit(Number(limit));

        return users;
    }

    async create({ username, email, password }) {
        const hash = await bcrypt.hash(password, 10);

        const existEmail = await UserModel.findOne({ email });
        const existUsername = await UserModel.findOne({ username });

        if (existEmail) {
            throw boom.badRequest('That email is not valid');
        }

        if (existUsername) {
            throw boom.badRequest('that username is not available');
        }

        const user = await UserModel.create({
            username,
            email,
            password: hash,
        });

        return user;
    }

    async update(id, body) {
        const user = await UserModel.findByIdAndUpdate(id, body, { new: true });

        if (!user) {
            throw boom.notFound('User not found');
        }

        return user;
    }

    async updateUsername(id, newUsername) {
        const existUsername = await UserModel.findOne({ username: newUsername });

        if (existUsername) {
            throw boom.forbidden('Username not available');
        }

        const user = await UserModel.findByIdAndUpdate(id, { username: newUsername }, { new: true });

        return user;
    }

    async updateProfileImg(id, image, fileExtension) {
        const imageName = `profileImages/${crypto.randomBytes(16).toString('hex') + '.' + fileExtension}`;

        await s3.putObject({
            Body: image,
            Bucket: config.S3_BUCKET_NAME,
            Key: imageName,
        }).promise();

        const imageURL = `https://${config.S3_BUCKET_NAME}.s3.amazonaws.com/${imageName}`;

        const updateUserProfileImage = await UserModel.findByIdAndUpdate(id, { profileImg: imageURL }, { new: true });

        return updateUserProfileImage;
    }

    async delete(id) {
        //Deberiamos en un futuro eliminar tambien los address relacionados al usuario que queremos elminar y tal vez hay que eliminar los tokens que tenemos almacenados con el correo del usuario que queremos eliminar
        const deleteUser = await UserModel.findByIdAndDelete(id);

        if (!deleteUser) {
            throw boom.notFound('User not found');
        }

        return deleteUser;
    }
}

module.exports = UserService;