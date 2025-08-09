// Arquivo: index.js


require('dotenv').config({ path: './variaveisambiente.env' });
const app = require('./app');
const logger = require('./configuracoes/logger');
const { connectDB } = require('./middlewares/dbMiddleware');

const port = process.env.PORT || 3333;

// Exporta o handler para Vercel
module.exports = app;

// Inicialização local (apenas se não estiver no ambiente Vercel)
if (process.env.VERCEL !== '1') {
    (async () => {
        try {
            await connectDB();
            app.listen(port, () => {
                logger.info(`Servidor rodando na porta ${port}`);
                logger.info(`Servidor rodando: http://localhost:${port}`);
            });
        } catch (error) {
            logger.error('Falha ao iniciar o servidor:', error);
            process.exit(1);
        }
    })();
}
