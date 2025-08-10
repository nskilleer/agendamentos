// Arquivo: index.js

require('dotenv').config({ path: './variaveisambiente.env' });
const app = require('./app');
const logger = require('./configuracoes/logger');
const { connectDB } = require('./middlewares/dbMiddleware');

const port = process.env.PORT || 3333;

// Função de inicialização (roda tanto no local quanto na Vercel)
(async () => {
    try {
        await connectDB();

        // Se for ambiente local, inicia o servidor
        if (process.env.VERCEL !== '1') {
            app.listen(port, () => {
                logger.info(`Servidor rodando na porta ${port}`);
                logger.info(`Servidor rodando: http://localhost:${port}`);
            });
        }
    } catch (error) {
        logger.error('Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
})();

// Exporta o app para que a Vercel possa gerenciar as requisições
module.exports = app;