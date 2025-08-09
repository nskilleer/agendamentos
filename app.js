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
const { dbMiddleware, connectDB } = require('./middlewares/dbMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Rotas para servir arquivos HTML diretamente
const htmlViews = [
    'login', 'cadastro', 'agenda', 'painelcli', 'painelpro', 'config'
];
htmlViews.forEach(view => {
    app.get(`/${view}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', `${view}.html`));
    });
});

// =====================================================
// Middlewares essenciais para o Express
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// Configuração do Express-Session 
// =====================================================
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET || 'nana96393898nana',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,

        ...(isProduction ? { sameSite: 'None' } : {}),
    }
}));

// =========================
// Middlewares Globais 
// =========================
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
            connectSrc: ["'self'", process.env.CORS_ORIGIN || 'http://localhost:3333'],
        },
    },
}));

// =====================================================
// Middleware de Conexão com o Banco de Dados (MongoDB)
// =====================================================
app.use(dbMiddleware);

// =====================================================
// Configuração para servir arquivos estáticos 
// =====================================================
app.use(express.static(path.join(__dirname, 'public')));


const apiRoutes = require('./routes');

// =====================================================
// Monta as rotas da API com o prefixo '/api'
// =====================================================
app.use('/api', apiRoutes);

// =====================================================
// Rotas de Páginas HTML
// =====================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rotas para servir arquivos HTML diretamente
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});
app.get('/agenda', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'agenda.html'));
});
app.get('/painelcli', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'painelcli.html'));
});
app.get('/painelpro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'painelpro.html'));
});
app.get('/config', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'config.html'));
});

// Middleware de erro no final da cadeia.
// Ele deve ser o último `app.use` a ser chamado.
app.use(errorHandler);


module.exports = app;