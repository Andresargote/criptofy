const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('../config/config')

const UserModel = require('../database/models/user.model');
const TokenModel = require('../database/models/token.model');
const logger = require('../utils/logger');

class AuthService {
    constructor() { }

    async login({ email, password }) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw boom.badRequest('That email is not valid');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw boom.badRequest();
        }

        const token = this.generateAndSignAccessToken(user);
        const refreshToken = this.generateAndSignRefreshToken(user);

        await TokenModel.create(
            {
                token: refreshToken,
                userId: user._id,
                email: user.email
            }
        );

        return {
            token,
            refreshToken
        }
    }

    async refreshToken(token) {
        //estas validaciones podrian ser un middleware
        const refreshToken = await TokenModel.findOne({ token });

        if (!refreshToken || !refreshToken.isValid) {
            throw boom.forbidden('Invalid refresh token');
        }

        const user = jwt.verify(token, config.REFRESH_KEY);
        const accessToken = this.generateAndSignAccessToken(user);

        return accessToken;
    }

    async sendRecovery(email) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw boom.unauthorized();
        };

        const token = this.generateAndSignRecoveryToken(user);
        const link = `https://myFrontend.com/recovery?token=${token}`;

        user.recoveryToken = token;
        await user.save();

        const mail = {
            from: "andresargote2019@gmail.com",
            to: "andresargote2019@gmail.com", // DESPUES CAMBIAR A EL EMAIL DEL USUARIO
            subject: "Recovery password",
            html: `<b>Ingresa a este link => ${link}</b>`,
        };

        const response = await this.sendMail(mail);

        return response;
    }

    async changePassword(token, newPassword) {
        try {
            const payload = jwt.verify(token, config.RECOVERY_KEY);
            const user = await UserModel.findById(payload.sub);

            if (user.recoveryToken !== token) {
                throw boom.unauthorized();
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            user.recoveryToken = null;

            await user.save();

            return { message: 'Password changed' };
        } catch (err) {
            throw boom.unauthorized();
        }
    }

    generateAndSignAccessToken(user) {
        const payload = {
            uid: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: config.JWT_EXPIRATION });

        return token;
    }

    generateAndSignRefreshToken(user) {
        const payload = {
            uid: user._id,
            role: user.role
        };

        const refreshToken = jwt.sign(payload, config.REFRESH_KEY, { expiresIn: config.JWT_REFRESH_EXPIRATION });

        return refreshToken;
    }

    generateAndSignRecoveryToken(user) {
        const payload = {
            sub: user._id
        };

        const token = jwt.sign(payload, config.RECOVERY_KEY, { expiresIn: config.JWT_RECOVERY_EXPIRATION });

        return token;

    }

    async sendMail(mail) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true, // true for 465, false for other ports
            port: 465,
            auth: {
                user: 'andresargote2019@gmail.com',//esto debe venir desde une env
                pass: 'qbpepexurtoemjbz'//esto debe de venir desde un env
            }
        });

        await transporter.sendMail(mail);

        return { message: 'Email sent' };
    }


}

module.exports = AuthService;