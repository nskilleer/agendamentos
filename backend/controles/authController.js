// controles/authController.js

const bcrypt = require('bcrypt');
const logger = require('../configuracoes/logger');
const { renderJson, renderError } = require('../utils/helpers');
const User = require('../models/User');

const authController = {
    /**
     * Lida com o login do usuário.
     */
    login: async (req, res) => {
        logger.info('Tentativa de login', { email: req.body.email });
        const { email, senha } = req.body;

        if (!email || !senha) {
            return renderError(res, 'E-mail e senha são obrigatórios.');
        }

        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                logger.warn('Tentativa de login falhou: Usuário não encontrado', { email });
                return renderError(res, 'Credenciais inválidas.');
            }

            const isMatch = await bcrypt.compare(senha, user.senha);

            if (!isMatch) {
                logger.warn('Tentativa de login falhou: Senha incorreta', { email });
                return renderError(res, 'Credenciais inválidas.');
            }

            // Configura a sessão
            req.session.logged_in = true;
            req.session.user_id = user._id;
            req.session.user_name = user.nome;
            req.session.user_type = user.userType;

            logger.info('Login bem-sucedido', { user_id: user._id, userEmail: user.email, user_type: user.userType });

            // Redirecionamento dinâmico
            let redirectUrl;
            if (user.userType === 'profissional') {
                redirectUrl = '/painelpro.html';
            } else if (user.userType === 'cliente') {
                redirectUrl = '/painelcli.html';
            } else {
                redirectUrl = '/';
            }

            return renderJson(res, true, 'Login bem-sucedido!', false, {
                redirect: redirectUrl,
                user_id: user._id,
                user_name: user.nome,
                user_type: user.userType
            });
        } catch (error) {
            logger.error('Erro no processo de login:', error);
            renderError(res, 'Erro interno do servidor durante o login.');
        }
    },

    /**
     * Lida com o registro de um novo usuário.
     */
    register: async (req, res) => {
        logger.info('Tentativa de registro', { email: req.body.email });
        const { nome, email, telefone, senha, userType } = req.body;

        if (!nome || !email || !senha || !userType) {
            return renderError(res, 'Nome, e-mail, senha e tipo de usuário são obrigatórios para o registro.');
        }

        const validUserTypes = ['profissional', 'cliente'];
        if (!validUserTypes.includes(userType)) {
            return renderError(res, 'Tipo de usuário inválido.');
        }

        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                logger.warn('Tentativa de registro falhou: E-mail já em uso', { email });
                return renderError(res, 'Este e-mail já está registrado.');
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const newUser = await User.create({
                nome: nome,
                email: email,
                telefone: telefone,
                senha: hashedPassword,
                userType: userType
            });

            req.session.logged_in = true;
            req.session.user_id = newUser._id;
            req.session.user_name = newUser.nome;
            req.session.user_type = newUser.userType;

            logger.info('Usuário registrado e logado com sucesso', { user_id: newUser._id, email: newUser.email, userType: newUser.userType });

            let redirectUrl;
            if (newUser.userType === 'profissional') {
                redirectUrl = '/painelpro.html';
            } else if (newUser.userType === 'cliente') {
                redirectUrl = '/painelcli.html';
            } else {
                redirectUrl = '/';
            }

            return renderJson(res, true, 'Registro bem-sucedido e login automático!', false, {
                redirect: redirectUrl,
                user_id: newUser._id,
                user_name: newUser.nome,
                user_type: newUser.userType
            });

        } catch (error) {
            logger.error('Erro no processo de registro:', error);
            renderError(res, 'Erro interno do servidor durante o registro.');
        }
    },

    /**
     * Lida com o logout do usuário.
     */
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                logger.error('Erro ao destruir sessão durante o logout:', err);
                return renderError(res, 'Erro no logout.');
            }
            logger.info('Logout realizado com sucesso', { sessionId: req.sessionID });
            res.clearCookie('connect.sid');
            return renderJson(res, true, 'Logout realizado com sucesso!', false);
        });
    },

    /**
     * Verifica a sessão do usuário.
     * Retorna 401 se não estiver logado.
     */
    checkSession: (req, res) => {
        if (req.session && req.session.logged_in) {
            return renderJson(res, true, 'Sessão ativa.', false, {
                user: {
                    id: req.session.user_id,
                    name: req.session.user_name,
                    type: req.session.user_type
                }
            });
        } else {
            // Retorna 200 mesmo sem sessão para evitar problemas no frontend
            return res.status(200).json({
                success: false,
                message: 'Nenhuma sessão ativa.',
                data: {
                    user: null
                }
            });
        }
    },

    /**
     * Obtém dados do perfil do profissional logado.
     */
    getProfissionalData: async (req, res) => {
        logger.info('Tentativa de obter dados do profissional', { user_id: req.session.user_id });
        const profissionalId = req.session.user_id;

        try {
            const profissional = await User.findById(profissionalId).select('-senha');

            if (!profissional) {
                logger.warn('Dados do profissional não encontrados', { profissionalId });
                return renderError(res, 'Dados do profissional não encontrados.', 404);
            }

            logger.info('Dados do profissional obtidos com sucesso', { profissionalId });
            return renderJson(res, true, 'Dados do profissional obtidos com sucesso.', false, profissional);

        } catch (error) {
            logger.error('Erro ao obter dados do profissional:', error);
            return renderError(res, 'Erro interno do servidor ao obter dados do profissional.');
        }
    }
};

module.exports = authController;
