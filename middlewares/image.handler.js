const boom = require('@hapi/boom');
const fileType = require('file-type');

const CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

async function isImage(req, res, next) {
    const contentType = req.get('content-type');

    if (!CONTENT_TYPES.includes(contentType)) {
        next(boom.badRequest('Content-type is not valid'));
    }

    const fileInformation = await fileType.fromBuffer(req.body);

    if (!CONTENT_TYPES.includes(fileInformation.mime)) {
        next(boom.badRequest('File does not match Content-type'));
    }

    req.fileExtension = fileInformation.ext;

    next();
};

module.exports = isImage;