//archivo de configuracion de env
const config = {
    env: process.env.NODE_ENV || 'development',
    mongodbURI: process.env.MONGODB_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    REFRESH_KEY: process.env.REFRESH_KEY,
    RECOVERY_KEY: process.env.RECOVERY_KEY,
    JWT_EXPIRATION: 600,
    JWT_REFRESH_EXPIRATION: 800,
    JWT_RECOVERY_EXPIRATION: "15min",
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
};

//LOS TIEMPOS DE EXPIRACION DEBERIAN DE SER PRIVADADOS, MOVER A LOS ENV

module.exports = { config };