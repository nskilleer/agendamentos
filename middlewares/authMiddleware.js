const logger = require('../configuracoes/logger');

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = [
    '/api/get_servicos_cliente',
    '/api/get_horarios_disponiveis',
    '/api/agendamentos',
    '/api/get_agendamentos_cliente',
    '/api/cancel_appointment_cliente'
];

const requireAuth = (req, res, next) => {
    // Ignorar verificação para rotas públicas
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    logger.info('Verificando sessão para requisição', {
        sessionId: req.sessionID,
        path: req.originalUrl
    });

    if (!req.session.logged_in) {
        if (req.accepts('html')) {
            return res.redirect('/login.html');
        }
        return res.status(401).json({ success: false, message: 'Não autorizado: Sessão expirada ou inválida.' });
    }

    next();
};

const checkUserType = (allowedTypes) => (req, res, next) => {
    // Ignorar verificação para rotas públicas
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    if (!req.session.user_type || !allowedTypes.includes(req.session.user_type)) {
        if (req.accepts('html')) {
            return res.redirect('/login.html');
        }
        return res.status(403).json({ success: false, message: 'Acesso não autorizado para este tipo de usuário.' });
    }
    next();
};

module.exports = {
    requireAuth,
    checkUserType
};