// middlewares/authMiddleware.js

const logger = require('../configuracoes/logger');

const requireAuth = (req, res, next) => {
    logger.info('Verificando sessão para requisição', {
        sessionId: req.sessionID,
        path: req.originalUrl
    });

    if (!req.session.logged_in) {
        if (req.accepts('html')) {
            return res.redirect('/login.html'); // ⬅️ CORRIGIDO!
        }
        return res.status(401).json({ success: false, message: 'Não autorizado: Sessão expirada ou inválida.' });
    }

    next();
};

const checkUserType = (allowedTypes) => (req, res, next) => {
    if (!req.session.user_type || !allowedTypes.includes(req.session.user_type)) {
        if (req.accepts('html')) {
            return res.redirect('/login.html'); // ⬅️ CORRIGIDO!
        }
        return res.status(403).json({ success: false, message: 'Acesso não autorizado para este tipo de usuário.' });
    }
    next();
};

module.exports = {
    requireAuth,
    checkUserType
};