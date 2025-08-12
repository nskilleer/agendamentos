const winston = require('winston');

// Usa uma variável de ambiente para definir o nível de log.
const logLevel = process.env.LOG_LEVEL || 'info';

// Formato de log personalizado para o console, incluindo o timestamp.
const consoleFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}] : ${message}`;
    if (Object.keys(metadata).length) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

// Configuração principal do Logger (Winston)
const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
    // Captura exceções não tratadas globalmente.
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ],
    exitOnError: false // Mantém o logger ativo mesmo após exceções não tratadas.
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            consoleFormat // Usa o formato personalizado com timestamp.
        )
    }));
}

module.exports = logger;