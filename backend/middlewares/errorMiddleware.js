const logger = require('../configuracoes/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Erro detectado na aplicação:', {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
    });

    // Resposta de erro padrão
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Erro interno do servidor.',
        error: process.env.NODE_ENV === 'development' ? err.stack : {} // Mostra o stack trace apenas em desenvolvimento
    });
};

module.exports = errorHandler;