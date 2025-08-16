const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const MongoStore = require('connect-mongo');
const fs = require('fs');

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
// Adiciona trust proxy para ambientes de produção
// =====================================================
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}


// =====================================================
// Middlewares essenciais para o Express
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// Configuração do Express-Session
// =====================================================
const isProduction = process.env.NODE_ENV === 'production';

console.log('🔧 Configurando sessões...');

// Configuração da store de sessão
// Temporariamente usando MemoryStore devido a conflitos com MongoDB
console.log('📦 Usando MemoryStore para sessões...');
const sessionStore = new session.MemoryStore();

app.use(session({
    secret: process.env.SESSION_SECRET || 'nana96393898nana',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: isProduction, // O cookie só será enviado via HTTPS em produção
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: isProduction ? 'none' : 'lax' // 'None' para CORS, 'Lax' para local
    }
}));

console.log('✅ Sessões configuradas com sucesso');

// =====================================================
// Middlewares Globais
// =====================================================
console.log('🔧 Configurando CORS...');

const corsOptions = {
    origin: function (origin, callback) {
        // Em desenvolvimento, aceita qualquer origin localhost
        if (process.env.NODE_ENV !== 'production') {
            // Lista de origens permitidas em desenvolvimento
            const allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:3001', 
                'http://localhost:3333',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:5175',
                'http://localhost:5176',
                'http://localhost:5177',
                'http://localhost:5178',
                'http://localhost:5179',
                'http://localhost:8080',
                'http://localhost:8081'
            ];
            
            // Permite requisições sem origin (ex: Postman, apps mobile)
            if (!origin) return callback(null, true);
            
            // Verifica se a origin está na lista ou é localhost
            if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
                return callback(null, true);
            }
            
            return callback(new Error('Não permitido pelo CORS'));
        } else {
            // Em produção, aceita múltiplas origens
            const allowedOrigins = [
                process.env.CORS_ORIGIN,
                'https://*.railway.app',
                'https://*.up.railway.app'
            ].filter(Boolean);
            
            // Permite requisições sem origin (ex: server-to-server)
            if (!origin) return callback(null, true);
            
            // Verifica se a origin está permitida
            const isAllowed = allowedOrigins.some(allowed => {
                if (allowed.includes('*')) {
                    const pattern = allowed.replace('*', '.*');
                    return new RegExp(pattern).test(origin);
                }
                return origin === allowed;
            });
            
            if (isAllowed) {
                return callback(null, true);
            }
            
            console.log(`⚠️ CORS bloqueou origin: ${origin}`);
            return callback(new Error('Não permitido pelo CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
console.log('✅ CORS configurado com sucesso');

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
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3333',
        process.env.CORS_ORIGIN,
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

console.log('🔧 Configurando Helmet (segurança)...');
app.use(helmet({
    contentSecurityPolicy: {
        directives: cspDirectives,
        reportOnly: false,
    },
    crossOriginEmbedderPolicy: false,
}));
console.log('✅ Helmet configurado com sucesso');

// =====================================================
// Middleware de Logging de Requisições
// =====================================================
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`📡 [${timestamp}] ${method} ${url} - IP: ${ip}`);
    
    // Log do corpo da requisição para POST/PUT/PATCH (sem senhas)
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
        const safeBody = { ...req.body };
        // Remove campos sensíveis dos logs
        if (safeBody.senha) safeBody.senha = '***';
        if (safeBody.password) safeBody.password = '***';
        console.log(`📄 Body:`, JSON.stringify(safeBody, null, 2));
    }
    
    // Intercepta a resposta para logar o status
    const originalSend = res.send;
    res.send = function(data) {
        const statusCode = res.statusCode;
        const statusEmoji = statusCode >= 200 && statusCode < 300 ? '✅' : 
                           statusCode >= 400 && statusCode < 500 ? '⚠️' : '❌';
        
        console.log(`${statusEmoji} [${timestamp}] ${method} ${url} - Status: ${statusCode}`);
        
        originalSend.call(this, data);
    };
    
    next();
});
console.log('✅ Middleware de logging configurado');

// =====================================================
// Middleware de Conexão com o Banco de Dados (MongoDB)
// =====================================================
console.log('🔧 Configurando middleware de banco de dados...');
app.use(dbMiddleware);
console.log('✅ Middleware de banco configurado');

// =====================================================
// Rotas da API
// =====================================================
console.log('🔧 Carregando rotas da API...');
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);
console.log('✅ Rotas da API configuradas');

// =====================================================
// Servir o frontend em produção
// =====================================================
if (process.env.NODE_ENV === 'production') {
    // O build do Vite está na pasta dist na raiz do projeto
    const frontendPath = path.join(__dirname, '..', 'dist');
    console.log(`🔍 Procurando frontend em: ${frontendPath}`);
    
    if (fs.existsSync(frontendPath)) {
        console.log('✅ Pasta dist encontrada, servindo frontend React');
        app.use(express.static(frontendPath));
        
        // Todas as rotas não-API devem retornar o index.html (SPA)
        app.get('*', (req, res) => {
            // Não servir index.html para rotas de API
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.join(frontendPath, 'index.html'));
            }
        });
    } else {
        console.log('⚠️ Pasta dist não encontrada - frontend não será servido');
        console.log('💡 Execute "npm run build" na raiz do projeto para criar o build');
    }
}

// =====================================================
// Middleware de erro (último a ser chamado)
// =====================================================
console.log('🔧 Configurando middleware de erro...');
app.use(errorHandler);
console.log('✅ Middleware de erro configurado');

console.log('🎉 App Express totalmente configurado!');
module.exports = app;