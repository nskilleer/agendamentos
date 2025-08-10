// Arquivo: index.js
require('dotenv').config({ path: './variaveisambiente.env' }); // Carrega variáveis de ambiente
const app = require('./app'); // Importa a aplicação Express
const logger = require('./configuracoes/logger'); // Importa o logger
const { connectDB } = require('./middlewares/dbMiddleware'); // Importa a função de conexão com o DB

const port = process.env.PORT || 3333; // Define a porta

// ===================================
// Inicialização do Servidor e Conexão com DB
// ===================================
async function startApplication() {
    try {
        await connectDB();
        app.listen(port, () => {
            logger.info(`Servidor rodando na porta ${port}`);
            logger.info(`Servidor rodando: http://localhost:${port}`);
        });
    } catch (error) {
        logger.error('Falha ao iniciar o servidor:', error);
        process.exit(1); // Encerrar o processo em caso de erro fatal
    }
}

// ⬅️ Chame a função para iniciar a aplicação!
startApplication();
