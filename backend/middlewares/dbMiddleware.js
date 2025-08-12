const mongoose = require('mongoose');
const logger = require('../configuracoes/logger');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            console.log('❌ ERRO: Variável MONGODB_URI não encontrada!');
            console.log('📁 Verifique o arquivo variaveisambiente.env');
            logger.error('Erro: A variável de ambiente MONGODB_URI não está definida.');
            logger.error('Por favor, verifique o arquivo variaveisambiente.env e garanta que MONGODB_URI esteja presente e correta.');
            throw new Error('MONGODB_URI não configurada');
        }

        console.log('🔍 Validando URI do MongoDB...');
        
        // Extrair informações da URI (sem mostrar senha)
        const uriInfo = mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
        console.log(`📊 URI: ${uriInfo}`);
        
        console.log('⏳ Estabelecendo conexão...');
        
        // Configurações de conexão otimizadas
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000, // 10 segundos
            connectTimeoutMS: 15000,         // 15 segundos
            socketTimeoutMS: 45000,          // 45 segundos
            maxPoolSize: 10,                 // Manter até 10 conexões
            minPoolSize: 1,                  // Manter pelo menos 1 conexão
            // bufferMaxEntries e bufferCommands são opções do Mongoose, não do MongoDB driver
        };

        // Conecta ao MongoDB
        await mongoose.connect(mongoURI, connectionOptions);

        // Informações da conexão
        const connection = mongoose.connection;
        console.log('✅ Conectado ao MongoDB com sucesso!');
        console.log(`📍 Host: ${connection.host}`);
        console.log(`🎯 Database: ${connection.name}`);
        console.log(`🔌 Estado: ${getConnectionState(connection.readyState)}`);
        console.log(`⚡ Pool de conexões configurado (min: 1, max: 10)`);
        
        logger.info('Conexão com MongoDB estabelecida com sucesso!');
        logger.info(`Host: ${connection.host}, Database: ${connection.name}`);

        // Event listeners para monitorar a conexão
        setupConnectionListeners();

    } catch (err) {
        console.log('❌ FALHA AO CONECTAR COM MONGODB:');
        console.log(`💥 Erro: ${err.message}`);
        
        if (err.message.includes('ENOTFOUND')) {
            console.log('🌐 Problema de rede - verifique sua conexão com a internet');
        } else if (err.message.includes('authentication failed')) {
            console.log('🔐 Erro de autenticação - verifique usuário e senha');
        } else if (err.message.includes('IP')) {
            console.log('🚫 IP não autorizado - configure o IP no MongoDB Atlas');
        }
        
        console.log('📋 Possíveis soluções:');
        console.log('   1. Verificar credenciais no arquivo variaveisambiente.env');
        console.log('   2. Verificar se o cluster do MongoDB Atlas está ativo');
        console.log('   3. Verificar se o IP atual está autorizado no MongoDB Atlas');
        console.log('   4. Verificar conexão com a internet');
        
        logger.error('Erro ao conectar ao MongoDB:', err);
        logger.error('Causa do erro:', err.message);
        
        // Propaga o erro para que o index.js possa lidar com ele
        throw err;
    }
};

// Função para traduzir o estado da conexão
function getConnectionState(state) {
    const states = {
        0: 'Desconectado',
        1: 'Conectado',
        2: 'Conectando',
        3: 'Desconectando'
    };
    return states[state] || 'Estado desconhecido';
}

// Configurar listeners para monitorar a conexão
function setupConnectionListeners() {
    const connection = mongoose.connection;

    connection.on('connected', () => {
        console.log('🔗 MongoDB - Conexão estabelecida');
        logger.info('MongoDB - Conexão estabelecida');
    });

    connection.on('disconnected', () => {
        console.log('🔌 MongoDB - Conexão perdida');
        logger.warn('MongoDB - Conexão perdida');
    });

    connection.on('reconnected', () => {
        console.log('🔄 MongoDB - Reconectado com sucesso');
        logger.info('MongoDB - Reconectado com sucesso');
    });

    connection.on('error', (error) => {
        console.log('⚠️ MongoDB - Erro na conexão:', error.message);
        logger.error('MongoDB - Erro na conexão:', error);
    });

    connection.on('close', () => {
        console.log('📴 MongoDB - Conexão fechada');
        logger.info('MongoDB - Conexão fechada');
    });
}

const dbMiddleware = (req, res, next) => {
    const connectionState = mongoose.connection.readyState;
    
    if (connectionState === 1) {
        // Conexão ativa - prosseguir
        next();
    } else {
        const stateText = getConnectionState(connectionState);
        console.log(`⚠️ Requisição bloqueada - MongoDB ${stateText}`);
        console.log(`📡 ${req.method} ${req.originalUrl} - Código: 503`);
        
        logger.warn(`Requisição recebida, mas MongoDB não está conectado. Estado: ${stateText} (${connectionState})`);
        logger.warn(`Requisição: ${req.method} ${req.originalUrl}`);
        
        res.status(503).json({ 
            success: false, 
            message: 'Serviço indisponível. O banco de dados não está conectado.',
            details: `Estado da conexão: ${stateText}`
        });
    }
};

module.exports = { connectDB, dbMiddleware };
