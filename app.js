// Arquivo: app.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// =====================================================
// Importa middlewares customizados
// =====================================================
const { requireAuth, checkUserType } = require('./middlewares/authMiddleware');
const { dbMiddleware } = require('./middlewares/dbMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// =====================================================
// Rotas para servir arquivos HTML diretamente da pasta 'views'
// =====================================================
const htmlViews = ['login', 'cadastro', 'agenda', 'painelcli', 'painelpro', 'config'];
htmlViews.forEach(view => {
    app.get(`/${view}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', `${view}.html`));
    });
});

// Rota principal '/' serve o login.html da pasta 'views'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// =====================================================
// Middlewares essenciais para o Express
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// Configuração do Express-Session
// ⚠️ IMPORTANTE: Em produção, use um store persistente (Redis ou MongoStore)
// =====================================================
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET || 'nana96393898nana',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        ...(isProduction ? { sameSite: 'None' } : {}),
    }
}));

// =====================================================
// Middlewares Globais
// =====================================================
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3333',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                'https://cdn.tailwindcss.com/',
                'https://cdn.jsdelivr.net/',
                "'unsafe-inline'"
            ],
            styleSrc: [
                "'self'",
                'https://cdn.tailwindcss.com/',
                'https://cdn.jsdelivr.net/',
                'https://cdnjs.cloudflare.com/',
                'https://fonts.googleapis.com/',
                "'unsafe-inline'"
            ],
            fontSrc: [
                "'self'",
                'https://fonts.gstatic.com/',
                'https://cdnjs.cloudflare.com/',
                'data:'
            ],
            imgSrc: ["'self'", 'data:'],
            connectSrc: [
                "'self'",
                process.env.CORS_ORIGIN || 'http://localhost:3333'
            ],
        },
    },
}));

// =====================================================
// Middleware de Conexão com o Banco de Dados (MongoDB)
// =====================================================
// No ambiente serverless, evite reconectar a cada requisição
app.use(dbMiddleware);

// =====================================================
// Configuração para servir arquivos estáticos
// =====================================================
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// Rotas da API
// =====================================================
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// =====================================================
// Middleware de erro (último a ser chamado)
// =====================================================
app.use(errorHandler);

module.exports = app;