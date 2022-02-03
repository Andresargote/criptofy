const express = require('express');
const passport = require('passport');

const AuthService = require('../services/auth.service');

const validatorHandler = require('../middlewares/validator.handler');
const { checkJWT } = require('../middlewares/auth.handler');
const { loginUserSchema, recoverySchema, changePasswordSchema } = require('../schemas/auth.schema');
const boom = require('@hapi/boom');

const router = express.Router();
const service = new AuthService();

router.post('/login',
    validatorHandler(loginUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const user = req.body;
            const login = await service.login(user);
            res.json(login);
        } catch (err) {
            next(err);
        }
    }
);

router.get('/refresh-token',
    async (req, res, next) => {
        try {
            const refreshToken = req.headers['x-auth-token'];

            if (!refreshToken) {
                throw boom.unauthorized('No refresh token provided!');
            }

            const accessToken = await service.refreshToken(refreshToken);

            res.json({ token: accessToken });


        } catch (err) {
            next(err);
        }
    }
);

router.post('/recovery',
    validatorHandler(recoverySchema, 'body'),
    async (req, res, next) => {
        try {
            const { email } = req.body;
            const response = await service.sendRecovery(email);

            res.json(response);
        } catch (err) {
            next(err);
        }
    }
);

router.post('/change-password',
    validatorHandler(changePasswordSchema, 'body'),
    async (req, res, next) => {
        try {
            const { token, password } = req.body;
            const response = await service.changePassword(token, password);
            res.json(response);

        } catch (err) {
            next(err);
        }
    }
);



//esta ruta la deberiamos de quitar no es un refresh
router.get('/renew',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const { uid } = req.user;

        const token = service.generateAndSignToken(uid);
        res.json({ token: token })
    }
);

module.exports = router;