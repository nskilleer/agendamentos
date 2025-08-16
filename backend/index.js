// Arquivo: index.js

require('dotenv').config({ path: './variaveisambiente.env' }); 
const app = require('./app'); 
const logger = require('./configuracoes/logger');
const { connectDB } = require('./middlewares/dbMiddleware');

const port = process.env.PORT || 3333;

// Função para exibir banner de inicialização
function displayStartupBanner() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 AGENDAFÁCIL - SISTEMA DE AGENDAMENTOS');
    console.log('='.repeat(80));
    console.log(`📅 Versão: 1.0.0`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Porta: ${port}`);
    console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`🔧 Node.js: ${process.version}`);
    console.log(`💻 Plataforma: ${process.platform}`);
    console.log('='.repeat(80) + '\n');
}

// Função para configurar handlers de processo
function setupProcessHandlers() {
    // Handler para encerramento gracioso
    process.on('SIGTERM', () => {
        console.log('\n⚡ Recebido SIGTERM - Iniciando encerramento gracioso...');
        logger.info('Servidor sendo encerrado por SIGTERM');
        gracefulShutdown();
    });

    process.on('SIGINT', () => {
        console.log('\n⚡ Recebido SIGINT (Ctrl+C) - Iniciando encerramento gracioso...');
        logger.info('Servidor sendo encerrado por SIGINT');
        gracefulShutdown();
    });

    // Handler para erros não capturados
    process.on('uncaughtException', (error) => {
        console.log('\n💥 ERRO NÃO CAPTURADO:');
        console.error('❌ Error:', error.message);
        console.error('📍 Stack:', error.stack);
        logger.error('Erro não capturado:', error);
        
        console.log('⚠️ Encerrando aplicação devido a erro crítico...');
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.log('\n💥 PROMISE REJEITADA NÃO TRATADA:');
        console.error('❌ Razão:', reason);
        console.error('📍 Promise:', promise);
        logger.error('Promise rejeitada não tratada:', { reason, promise });
        
        console.log('⚠️ Encerrando aplicação devido a promise rejeitada...');
        process.exit(1);
    });
}

// Função para encerramento gracioso
function gracefulShutdown() {
    console.log('\n' + '='.repeat(80));
    console.log('🛑 ENCERRANDO AGENDAFÁCIL');
    console.log('='.repeat(80));
    console.log(`⏰ Finalizado em: ${new Date().toLocaleString('pt-BR')}`);
    
    // Aqui você pode adicionar código para fechar conexões, etc.
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
        console.log('🔌 Fechando conexão com MongoDB...');
        mongoose.connection.close(() => {
            console.log('✅ Conexão com MongoDB fechada com sucesso');
            logger.info('Conexão com MongoDB fechada');
        });
    }
    
    console.log('👋 Servidor encerrado com sucesso!');
    console.log('='.repeat(80) + '\n');
    logger.info('Servidor encerrado graciosamente');
    
    process.exit(0);
}

// Inicializa a aplicação
async function startServer() {
    try {
        // Exibe banner de inicialização
        displayStartupBanner();
        
        // Configura handlers de processo
        setupProcessHandlers();
        
        console.log('⚙️ Configurando servidor Express...');
        
        // Inicia o servidor
        const server = app.listen(port, '0.0.0.0', () => {
            console.log('✅ Servidor HTTP iniciado com sucesso!');
            console.log(`🌐 URL Local: http://localhost:${port}`);
            console.log(`📡 URL API: http://localhost:${port}/api`);
            console.log(`🔒 CORS configurado para desenvolvimento (aceita todas as portas localhost)`);
            
            logger.info(`Servidor iniciado na porta ${port}`);
            logger.info(`URL: http://localhost:${port}`);
        });

        // Configura timeout do servidor
        server.timeout = 30000; // 30 segundos
        
        console.log('🔌 Tentando conectar ao MongoDB...');
        
        // Tenta conectar ao banco de dados (não bloqueia a inicialização)
        connectDB()
            .then(() => {
                console.log('✅ Aplicação totalmente inicializada!');
                console.log('🎉 AgendaFácil está pronto para receber requisições!\n');
            })
            .catch((dbError) => {
                console.log('⚠️ Servidor iniciado, mas sem conexão com banco de dados');
                console.log('📊 Algumas funcionalidades podem estar limitadas\n');
                console.log('❌ Erro do MongoDB:', dbError.message);
            });
        
    } catch (error) {
        console.log('\n💥 ERRO FATAL AO INICIAR SERVIDOR:');
        console.error('❌ Error:', error.message);
        console.error('📍 Stack:', error.stack);
        logger.error('Falha crítica ao iniciar o servidor:', error);
        
        console.log('⚠️ Encerrando aplicação...\n');
        process.exit(1);
    }
}

// Inicia a aplicação
console.log('🔄 Iniciando AgendaFácil...\n');
startServer();
