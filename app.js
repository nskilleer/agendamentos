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
// Configuração para servir arquivos estáticos
// =====================================================
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal '/' para a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// =====================================================
// Configuração do Express-Session
// =====================================================
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET || 'nana96393898nana',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'sessions',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60,
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
    origin: process.env.CORS_ORIGIN || '*', // Permitir qualquer origem
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Configuração de CSP flexível para desenvolvimento
const cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: [
        "'self'",
        'https://cdn.tailwindcss.com',
        'https://cdn.jsdelivr.net',
        'https://code.jquery.com',
        "'unsafe-inline'"
    ],
    styleSrc: [
        "'self'",
        'https://cdn.tailwindcss.com',
        'https://cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com',
        'https://fonts.googleapis.com',
        "'unsafe-inline'"
    ],
    fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com',
        'data:'
    ],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: [
        "'self'",
        process.env.CORS_ORIGIN || 'http://localhost:3333',
        'https://*.tiles.mapbox.com',
        'https://api.mapbox.com'
    ],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
};

if (!isProduction) {
    // Permite eval() e websockets em desenvolvimento
    cspDirectives.scriptSrc.push("'unsafe-eval'");
    cspDirectives.connectSrc.push('ws://localhost:*/');
}

app.use(helmet({
    contentSecurityPolicy: {
        directives: cspDirectives,
        reportOnly: false,
    },
    crossOriginEmbedderPolicy: false,
}));

// =====================================================
// Middleware de Conexão com o Banco de Dados (MongoDB)
// =====================================================
app.use(dbMiddleware);

// =====================================================
// Rotas da API
// =====================================================
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// =====================================================
// Middleware para tratar rotas não encontradas
// =====================================================
app.use((req, res, next) => {
    // Permite acesso direto a arquivos HTML
    if (req.path.endsWith('.html') || req.path.includes('.')) {
        return next();
    }

    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } else {
        res.status(404).json({ success: false, message: 'Rota não encontrada' });
    }
});

// =====================================================
// Middleware de erro (último a ser chamado)
// =====================================================
app.use(errorHandler);

module.exports = app;