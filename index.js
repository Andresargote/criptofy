require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const fileUpload = require('express-fileupload');

const logger = require('./utils/logger');

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const { dbConnection } = require('./database/config.js');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: 'image/*', limit: '1mb' }));//poder subir archivos binarios. Solo para imagenes
app.use(cors());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

require('./utils/auth');

dbConnection();

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

module.exports = { app };