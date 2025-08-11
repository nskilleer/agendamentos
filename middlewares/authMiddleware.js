// Arquivo: middlewares/authMiddleware.js

const logger = require('../configuracoes/logger');

const requireAuth = (req, res, next) => {
    logger.info('Verificando sessão para rota protegida', {
        sessionId: req.sessionID,
        path: req.originalUrl
    });

    if (!req.session || !req.session.logged_in) {
        // Se o cliente espera uma página HTML, redireciona para a página de login
        // Isso é útil para requisições de páginas (navegador)
        if (req.accepts('html')) {
            return res.redirect('/login.html');
        }
        // Se a requisição for de uma API, retorna um erro 401 JSON
        // Isso é útil para chamadas de 'fetch' ou 'axios'
        return res.status(401).json({ success: false, message: 'Não autorizado: Sessão expirada ou inválida.' });
    }

    next();
};

const checkUserType = (allowedTypes) => (req, res, next) => {
    if (!req.session || !req.session.user_type || !allowedTypes.includes(req.session.user_type)) {
        // Se o cliente espera uma página HTML, redireciona ou retorna erro
        if (req.accepts('html')) {
            // Em caso de acesso negado, é melhor mostrar uma página de erro
            // ou redirecionar para uma página principal, mas o login também serve.
            return res.redirect('/login.html');
        }
        // Para requisições de API, retorna um erro 403
        return res.status(403).json({ success: false, message: 'Acesso não autorizado para este tipo de usuário.' });
    }
    next();
};

module.exports = {
    requireAuth,
    checkUserType
};