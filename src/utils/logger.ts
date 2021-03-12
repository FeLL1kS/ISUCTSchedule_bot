import * as winston from 'winston';

const logger: winston.Logger = winston.createLogger({
    level: process.env.SV_LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
    ],
});

export default logger;
