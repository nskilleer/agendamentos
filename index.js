// Arquivo: index.js

require('dotenv').config({ path: './variaveisambiente.env' }); // Carrega variáveis de ambiente
const app = require('./app'); // Importa a aplicação Express JÁ CONFIGURADA do app.js
const logger = require('./configuracoes/logger'); // Importa o logger
const { connectDB } = require('./middlewares/dbMiddleware');

const port = process.env.PORT || 3333; // Define a porta

// ===================================
// Inicialização do Servidor e Conexão com DB
// ===================================
async function startApplication() {
    try {
        await connectDB();
        // A lógica do try/catch garante que o servidor só subirá após o sucesso.

        app.listen(port, () => {
            logger.info(`Servidor rodando na porta ${port}`);
            // Substitui console.log por logger.info para padronização.
            logger.info(`Servidor rodando: http://localhost:${port}`);
        });
    } catch (error) {
        logger.error('Falha ao iniciar o servidor:', error);
        process.exit(1); // Encerrar o processo em caso de erro fatal
    }
}

startApplication(); // Chama a função para iniciar tudo