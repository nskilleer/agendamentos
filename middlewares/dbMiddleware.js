const mongoose = require('mongoose');
const logger = require('../configuracoes/logger');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            logger.error('Erro: A variável de ambiente MONGODB_URI não está definida.');
            logger.error('Por favor, verifique o arquivo variaveisambiente.env e garanta que MONGODB_URI esteja presente e correta.');
            process.exit(1);
        }

        logger.info('Tentando conectar ao MongoDB...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info('Conexão com MongoDB estabelecida com sucesso!');

    } catch (err) {
        // Loga o erro exato antes de sair do processo
        logger.error('Erro fatal ao conectar ao MongoDB:', err);
        logger.error('Causa do erro:', err.message);
        logger.error('Possíveis causas: Credenciais incorretas, cluster do MongoDB inativo ou permissões de rede (IP) não configuradas no MongoDB Atlas.');
        process.exit(1);
    }
};

const dbMiddleware = (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        next();
    } else {
        logger.warn('Requisição recebida, mas MongoDB não está conectado. (readyState: ' + mongoose.connection.readyState + ')');
        res.status(503).json({ success: false, message: 'Serviço indisponível. O banco de dados não está conectado.' });
    }
};

module.exports = { connectDB, dbMiddleware };