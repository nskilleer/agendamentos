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
const { dbMiddleware } = require('./middlewares/dbMiddleware'); // 'connectDB' não é usado aqui
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
// Configuração do Express-Session
// ANTES dos middlewares globais para garantir que a sessão
// esteja disponível para todos os outros middlewares.
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
    origin: process.env.CORS_ORIGIN || '*',
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
// Configuração para servir arquivos estáticos e páginas públicas
// Mova para o topo para que páginas como painelcli.html
// e login.html sejam acessíveis sem autenticação.
// =====================================================
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// Rotas da API
// =====================================================
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// =====================================================
// Rota para páginas HTML que requerem autenticação
// =====================================================
app.get('/painelpro.html', requireAuth, checkUserType(['profissional']), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'painelpro.html'));
});

// =====================================================
// Rota de fallback para a página de login
// Qualquer outra rota não definida será redirecionada para o login.
// =====================================================
app.get('*', (req, res) => {
    // Exclui arquivos estáticos de serem redirecionados
    if (req.path.endsWith('.html') || req.path.includes('.')) {
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// =====================================================
// Middleware de erro (último a ser chamado)
// =====================================================
app.use(errorHandler);

module.exports = app;