// arquivo: controles/serviceController.js

const logger = require('../configuracoes/logger');
const { renderJson, renderError } = require('../utils/helpers');
const Service = require('../models/Service');
const mongoose = require('mongoose');

const serviceController = {
    //========================================================
    //Adiciona um novo serviço para o profissional logado.
    //Requer autenticação.
    //========================================================  
    addServico: async (req, res) => {
        logger.info('Tentativa de adicionar serviço', { user_id: req.session.user_id, body: req.body });

        // Desestruturar os campos com os nomes corretos do modelo (nome e preco)
        const { nome, duracao_min, preco } = req.body;
        const profissionalId = req.session.user_id;

        // Validação básica dos campos
        if (!nome || !duracao_min || preco === undefined || !profissionalId) {
            return renderError(res, 'Todos os campos (nome do serviço, duração e valor) são obrigatórios.', 400);
        }

        const duracaoServicoMin = parseInt(duracao_min);
        const valorServico = parseFloat(preco);

        // Validações de tipo e valor
        if (isNaN(duracaoServicoMin) || duracaoServicoMin <= 0) {
            return renderError(res, 'Duração inválida. Deve ser um número inteiro positivo.', 400);
        }
        if (isNaN(valorServico) || valorServico < 0) {
            return renderError(res, 'Valor inválido. Deve ser um número positivo.', 400);
        }

        const novoServicoPayload = {
            userId: profissionalId,
            nome: nome,
            duracao_min: duracaoServicoMin,
            preco: valorServico
        };

        try {
            const novoServico = await Service.create(novoServicoPayload);

            logger.info('Serviço adicionado com sucesso', { servicoId: novoServico._id, profissionalId });

            renderJson(res, true, 'Serviço adicionado com sucesso!', false, novoServico);

        } catch (err) {
            logger.error('Erro ao adicionar serviço:', err);
            if (err.code === 11000) {
                // O erro 11000 é para índices únicos duplicados.
                return renderError(res, 'Já existe um serviço com este nome para este profissional.', 409);
            }
            renderError(res, 'Erro ao adicionar serviço. Por favor, tente novamente mais tarde.', 500);
        }
    },

    //=============================================================
    //Obtém todos os serviços associados ao profissional logado.
    //Requer autenticação.
    //=============================================================
    getServicos: async (req, res) => {
        logger.info('Buscando serviços para profissional', { user_id: req.session.user_id });
        const profissionalId = req.session.user_id;

        try {
            const servicos = await Service.find({ userId: profissionalId }).sort({ nome: 1 });

            logger.info('Serviços encontrados', { user_id: profissionalId, count: servicos.length });
            renderJson(res, true, 'Serviços encontrados.', false, servicos);

        } catch (err) {
            logger.error('Erro ao buscar serviços:', err);
            renderError(res, 'Erro ao buscar serviços. Por favor, tente novamente mais tarde.', 500);
        }
    },

    //===================================================================
    //Obtém um único serviço pelo ID, associado ao profissional logado.
    //Requer autenticação.
    //===================================================================
    getServicoById: async (req, res) => {
        logger.info('Tentativa de buscar serviço por ID', { user_id: req.session.user_id, servicoId: req.params.id });
        const servicoId = req.params.id;
        const profissionalId = req.session.user_id;

        if (!servicoId || !mongoose.Types.ObjectId.isValid(servicoId)) {
            return renderError(res, 'ID do serviço inválido.', 400);
        }

        try {
            const servico = await Service.findOne({ _id: servicoId, userId: profissionalId });

            if (!servico) {
                logger.warn('Serviço não encontrado ou não pertence ao profissional', { servicoId, profissionalId });
                return renderError(res, 'Serviço não encontrado ou você não tem permissão para acessá-lo.', 404);
            }

            logger.info('Serviço encontrado com sucesso', { servicoId, profissionalId });
            renderJson(res, true, 'Serviço obtido com sucesso!', false, servico);

        } catch (err) {
            logger.error('Erro ao buscar serviço por ID:', err);
            renderError(res, 'Erro interno do servidor ao buscar o serviço.', 500);
        }
    },

    //===============================================================
    //Obtém os serviços de um profissional específico para clientes.
    //===============================================================

    getServicosCliente: async (req, res) => {
        const profissionalId = req.query.pro_id;
        logger.info('Tentativa de buscar serviços para cliente', { profissionalId });

        if (!profissionalId || !mongoose.Types.ObjectId.isValid(profissionalId)) {
            return renderError(res, 'ID do profissional inválido ou ausente.', 400);
        }

        try {
            const servicos = await Service.find({ userId: profissionalId }).sort({ nome: 1 });

            if (servicos.length === 0) {
                logger.info('Nenhum serviço encontrado para o profissional', { profissionalId });
                return renderJson(res, true, 'Nenhum serviço disponível no momento.', false, []);
            }

            logger.info('Serviços encontrados para cliente', { profissionalId, count: servicos.length });
            renderJson(res, true, 'Serviços encontrados.', false, servicos);

        } catch (err) {
            logger.error('Erro ao buscar serviços para o cliente:', err);
            renderError(res, 'Erro ao buscar serviços. Por favor, tente novamente mais tarde.', 500);
        }
    },



    //========================================================
    //Deleta um serviço específico do profissional logado.
    //Requer autenticação.
    //========================================================
    deleteServico: async (req, res) => {
        logger.info('Tentativa de deletar serviço', { user_id: req.session.user_id, servicoId: req.params.id });
        const servicoId = req.params.id;
        const profissionalId = req.session.user_id;

        if (!servicoId || !mongoose.Types.ObjectId.isValid(servicoId)) {
            return renderError(res, 'ID do serviço inválido ou ausente.', 400);
        }

        try {
            const result = await Service.findOneAndDelete({ _id: servicoId, userId: profissionalId });

            if (!result) {
                logger.warn('Serviço não encontrado ou não pertence ao profissional para exclusão', { servicoId, profissionalId });
                return renderError(res, 'Serviço não encontrado ou você não tem permissão para deletá-lo.', 404);
            }

            logger.info('Serviço deletado com sucesso', { servicoId, profissionalId });
            renderJson(res, true, 'Serviço deletado com sucesso!');

        } catch (err) {
            logger.error('Erro ao deletar serviço:', err);
            renderError(res, 'Erro ao deletar serviço. Por favor, tente novamente mais tarde.', 500);
        }
    }
};

module.exports = serviceController;