module.exports = {

    requireAuth: (req, res, next) => {
        console.log('Sessão na requisição:', req.session);
        if (!req.session.logged_in) {
            if (req.accepts('html')) {
                return res.redirect('/login');
            }

            return res.status(401).json({ success: false, message: 'Não autorizado: Sessão expirada ou inválida.' });
        }

        next();
    },


    checkUserType: (allowedTypes) => (req, res, next) => {
        if (!req.session.user_type || !allowedTypes.includes(req.session.user_type)) {
            if (req.accepts('html')) {
                return res.redirect('/login');
            }

            return res.status(403).json({ success: false, message: 'Acesso não autorizado para este tipo de usuário.' });
        }
        next();
    }
};