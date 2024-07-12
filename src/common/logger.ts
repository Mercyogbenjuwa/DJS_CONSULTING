const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;



const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});


const sensitiveInfoFilter = format((info) => {
    const sensitiveFields = [
        'api_key',
        'authorization',
        'secret_key',  
        'clientId',
        'password',
        'req.body.password',
    ];

    if (typeof info.message === 'string') {
        sensitiveFields.forEach(field => {
            if (info.message.includes(field)) {
                info.message = info.message.replace(new RegExp(info.message[field], 'g'), '[REDACTED]');
            }
        });
    }

    return info;
});


export const logger = createLogger({
    format: combine(
        timestamp(),
        sensitiveInfoFilter(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});





