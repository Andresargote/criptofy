const express = require('express');
const boom = require('@hapi/boom');

const UserService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkJWT } = require('../middlewares/auth.handler');
const isImage = require('../middlewares/image.handler');
const { createUserSchema, updateUserSchema, updateUsernameSchema, idSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new UserService();

router.get('/', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const users = await service.getAll(limit);

        res.json(users);

    } catch (err) {
        next(err);
    }
}
);

router.post('/register',
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newUser = await service.create(body);

            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    }
);

router.put('/:id',
    checkJWT,
    validatorHandler(idSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;

            if (id !== req.user.uid) {
                throw boom.forbidden('You are not allowed to update this user');
            }


            const updatedUser = await service.update(id, body);

            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    }
);

router.patch('/:id/username',
    checkJWT,
    validatorHandler(idSchema, 'params'),
    validatorHandler(updateUsernameSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { username } = req.body;

            if (id !== req.user.uid) {
                throw boom.forbidden('You are not allowed to update this user');
            }

            const updatedUsername = await service.updateUsername(id, username);

            res.json(updatedUsername);

        } catch (err) {
            next(err);
        }
    }
);

router.patch('/:id/profile-image',
    checkJWT,
    validatorHandler(idSchema, 'params'),
    isImage,
    async (req, res, next) => {
        try {
            const { id } = req.params;

            const image = req.body;
            const fileExtension = req.fileExtension;

            if (id !== req.user.uid) {
                throw boom.forbidden('You are not allowed to update this user');
            }

            const updateProfileImg = await service.updateProfileImg(id, image, fileExtension);

            res.json(updateProfileImg);

        } catch (err) {
            next(err);
        }
    }
);

router.delete('/:id',
    checkJWT,
    validatorHandler(idSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;

            if (id !== req.user.uid) {
                throw boom.forbidden('You are not allowed to delete this user');
            }

            const deletedUser = await service.delete(id);

            res.json(deletedUser);

        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;