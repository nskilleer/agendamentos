// Arquivo: app.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const MongoStore = require('connect-mongo'); 

// =====================================================
// Importa middlewares customizados
// =====================================================
const { requireAuth, checkUserType } = require('./middlewares/authMiddleware');
const { dbMiddleware, connectDB } = require('./middlewares/dbMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

// =====================================================
// DECLARAÇÃO DO APLICATIVO EXPRESS
// =====================================================
const app = express();

// =====================================================
// Middlewares essenciais para o Express
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// Rotas para servir arquivos HTML diretamente
// =====================================================
const htmlViews = [
    'login', 'cadastro', 'agenda', 'painelcli', 'painelpro', 'config'
];
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
// Configuração do Express-Session
// ⚠️ AGORA USANDO MongoStore para sessões persistentes
// =====================================================
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET || 'nana96393898nana',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ // ⬅️ Nova configuração
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'sessions', // Nome para o banco de sessões
        collectionName: 'sessions', // Nome da coleção de sessões
        ttl: 24 * 60 * 60, // Tempo de vida da sessão (em segundos)
    }),
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
