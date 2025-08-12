// arquivo: controles/appointmentController.js

const logger = require('../configuracoes/logger');
const { renderJson, renderError } = require('../utils/helpers');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const mongoose = require('mongoose');

/**
 * Determina o status de um agendamento com base na data e no campo 'cancelado'.
 * @param {object} appointment - O objeto do agendamento.
 * @returns {string} O status: 'cancelado', 'concluido' ou 'agendado'.
 */
const getAppointmentStatus = (appointment) => {
    if (appointment.cancelado) {
        return 'cancelado';
    }

    // Se a data de término do agendamento já passou, ele é 'concluido'
    const now = new Date();
    if (appointment.end < now) {
        return 'concluido';
    }

    return 'agendado';
};

const appointmentController = {
    createAppointment: async (req, res) => {
        logger.info('Payload recebido:', req.body);

        let userId;
        if (req.session.user_type === 'profissional' && req.session.user_id) {
            userId = req.session.user_id;
        } else {
            userId = req.body.profissionalId;
        }

        const { serviceId, start, duracao_min, nomeCliente, telefoneCliente } = req.body;

        if (!userId || !serviceId || !start || !duracao_min || !nomeCliente || !telefoneCliente) {
            return renderError(res, 'Dados do profissional, serviço, cliente, data/hora de início e duração são obrigatórios.', 400);
        }

        try {
            const profissional = await User.findById(userId);
            if (!profissional || profissional.userType !== 'profissional') {
                return renderError(res, 'Profissional inválido ou não encontrado.', 404);
            }
            const service = await Service.findById(serviceId);
            if (!service) {
                return renderError(res, 'Serviço inválido ou não encontrado.', 404);
            }

            const appointmentStart = new Date(start);
            if (isNaN(appointmentStart.getTime())) {
                return renderError(res, 'Formato de data/hora de início inválido.', 400);
            }
            const appointmentEnd = new Date(appointmentStart.getTime() + duracao_min * 60 * 1000);

            const overlappingAppointment = await Appointment.findOne({
                userId: userId,
                cancelado: false,
                $or: [
                    { start: { $lt: appointmentEnd, $gte: appointmentStart } },
                    { end: { $gt: appointmentStart, $lte: appointmentEnd } },
                    { start: { $lte: appointmentStart }, end: { $gte: appointmentEnd } }
                ]
            });

            if (overlappingAppointment) {
                logger.warn('Criação de agendamento falhou: Conflito de horário', { userId, start });
                return renderError(res, 'Horário indisponível. Há um conflito com outro agendamento.');
            }

            let cliente = await User.findOne({ telefone: telefoneCliente, userType: 'cliente' });
            if (!cliente) {
                cliente = await User.create({
                    nome: nomeCliente,
                    telefone: telefoneCliente,
                    userType: 'cliente',
                });
                logger.info('Novo cliente criado sem e-mail ou senha', { clientId: cliente._id });
            }

            const newAppointment = await Appointment.create({
                userId: userId,
                clientId: cliente._id,
                serviceId,
                nomeCliente,
                telefoneCliente,
                start: appointmentStart,
                end: appointmentEnd,
                duracao_min,
            });

            logger.info('Agendamento criado com sucesso', { appointmentId: newAppointment._id });
            return renderJson(res, true, 'Agendamento criado com sucesso!', false, newAppointment);

        } catch (error) {
            logger.error('Erro ao criar agendamento:', error);
            return renderError(res, 'Erro interno do servidor ao criar agendamento.', 500);
        }
    },

    getUserData: async (req, res) => {
        const userId = req.session.user_id;
        logger.info('Tentativa de obter dados do profissional', { userId });

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', true);
        }

        try {
            const profissional = await User.findById(userId, 'nome email');
            if (!profissional) {
                return renderError(res, 'Profissional não encontrado.', true);
            }
            return renderJson(res, true, 'Dados do profissional obtidos com sucesso.', false, profissional);
        } catch (err) {
            logger.error('Erro ao obter dados do profissional:', err);
            return renderError(res, 'Erro ao obter dados do profissional. Por favor, tente novamente mais tarde.');
        }
    },

    getAgendamentos: async (req, res) => {
        const userId = req.session.user_id;
        const { start, end } = req.query;
        logger.info('Tentativa de obter agendamentos para o calendário', { userId, query: req.query });

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', true);
        }
        if (!start || !end) {
            return renderError(res, 'Datas de início e fim são obrigatórias.');
        }

        try {
            const agendamentos = await Appointment.find({
                userId: userId,
                start: { $gte: new Date(start), $lte: new Date(end) },
                end: { $lte: new Date(end) },
                cancelado: false
            }).populate('serviceId');

            const formattedEvents = agendamentos.map(agendamento => {
                const serviceName = (agendamento.serviceId && agendamento.serviceId.nome) || 'Serviço Removido';
                const serviceId = agendamento.serviceId ? agendamento.serviceId._id : null;
                const status = getAppointmentStatus(agendamento);

                return {
                    id: agendamento._id,
                    title: `${agendamento.nomeCliente || 'Agendamento'} - ${serviceName}`,
                    start: agendamento.start.toISOString(),
                    end: agendamento.end ? agendamento.end.toISOString() : undefined,
                    extendedProps: {
                        serviceId: serviceId,
                        servico: serviceName,
                        telefone: agendamento.telefoneCliente,
                        status: status,
                        cancelado: agendamento.cancelado
                    }
                };
            });

            logger.info('Agendamentos encontrados para o calendário', { userId, count: formattedEvents.length });
            return renderJson(res, true, 'Agendamentos obtidos com sucesso.', false, formattedEvents);

        } catch (err) {
            logger.error('Erro ao obter agendamentos para o calendário:', err);
            return renderError(res, 'Erro ao obter agendamentos. Por favor, tente novamente mais tarde.');
        }
    },

    getAgendamentosHoje: async (req, res) => {
        const userId = req.session.user_id;
        logger.info('Tentativa de obter agendamentos de hoje', { userId });
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', true);
        }

        try {
            const agendamentos = await Appointment.find({
                userId: userId,
                start: { $gte: startOfDay, $lte: endOfDay },
                cancelado: { $ne: true }
            })
                .sort({ start: 1 })
                .populate('serviceId');

            const formattedEvents = agendamentos.map(agendamento => {
                const serviceName = (agendamento.serviceId && agendamento.serviceId.nome) || 'Serviço Removido';
                const serviceId = agendamento.serviceId ? agendamento.serviceId._id : null;
                const status = getAppointmentStatus(agendamento);

                return {
                    id: agendamento._id,
                    title: `${agendamento.nomeCliente || 'Agendamento'} - ${serviceName}`,
                    start: agendamento.start.toISOString(),
                    end: agendamento.end ? agendamento.end.toISOString() : undefined,
                    extendedProps: {
                        serviceId: serviceId,
                        servico: serviceName,
                        telefone: agendamento.telefoneCliente,
                        status: status,
                        cancelado: agendamento.cancelado
                    }
                };
            });

            logger.info('Agendamentos de hoje encontrados', { userId, count: formattedEvents.length });
            return renderJson(res, true, 'Agendamentos obtidos com sucesso.', false, formattedEvents);

        } catch (err) {
            logger.error('Erro ao obter agendamentos de hoje:', err);
            return renderError(res, 'Erro ao obter agendamentos. Por favor, tente novamente mais tarde.');
        }
    },

    getAgendamentosCancelados: async (req, res) => {
        const userId = req.session.user_id;
        const query = req.query.q || ''; // Define a query, se existir, ou uma string vazia
        logger.info('Tentativa de obter agendamentos cancelados', { userId, query: req.query });

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', true);
        }

        try {
            let findQuery = {
                userId: userId,
                cancelado: true // Apenas agendamentos cancelados
            };

            if (query) {
                findQuery.$or = [
                    { nomeCliente: { $regex: query, $options: 'i' } },
                    { telefoneCliente: { $regex: query, $options: 'i' } }
                ];
            }

            const agendamentos = await Appointment.find(findQuery).sort({ start: -1 }).populate('serviceId');

            const formattedEvents = agendamentos.map(agendamento => {
                const serviceName = (agendamento.serviceId && agendamento.serviceId.nome) || 'Serviço Removido';
                const status = 'cancelado';

                return {
                    nomeCliente: agendamento.nomeCliente || 'Agendamento',
                    telefoneCliente: agendamento.telefoneCliente,
                    servico: serviceName,
                    start: agendamento.start.toISOString(),
                    end: agendamento.end ? agendamento.end.toISOString() : undefined,
                    status: status,
                    id: agendamento._id
                };
            });

            logger.info('Agendamentos cancelados encontrados', { userId, count: formattedEvents.length });
            return renderJson(res, true, 'Agendamentos cancelados obtidos com sucesso.', false, formattedEvents);

        } catch (err) {
            logger.error('Erro ao obter agendamentos cancelados:', err);
            return renderError(res, 'Erro ao obter agendamentos. Por favor, tente novamente mais tarde.');
        }
    },

    getClientes: async (req, res) => {
        const userId = req.session.user_id;
        logger.info('Tentativa de obter clientes do profissional', { userId });

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', true);
        }

        try {
            const clientIds = await Appointment.find({ userId: userId })
                .distinct('clientId');

            const clientes = await User.find({
                _id: { $in: clientIds },
                userType: 'cliente'
            }).select('nome telefone email');

            logger.info('Clientes encontrados para o profissional', { userId, count: clientes.length });
            return renderJson(res, true, 'Clientes obtidos com sucesso.', false, clientes);

        } catch (error) {
            logger.error('Erro ao obter clientes do profissional:', error);
            return renderError(res, 'Erro interno do servidor ao obter a lista de clientes.');
        }
    },

    cancelAppointmentProfissional: async (req, res) => {
        const { appointmentId } = req.body;
        const userId = req.session.user_id;
        logger.info('Tentativa de cancelar agendamento (profissional)', { appointmentId, userId });

        if (!appointmentId) {
            return renderError(res, 'ID do agendamento é obrigatório.');
        }

        try {
            const appointment = await Appointment.findOneAndUpdate(
                {
                    _id: appointmentId,
                    userId: userId,
                    cancelado: false // Só cancela se ainda não estiver cancelado
                },
                { cancelado: true },
                { new: true }
            );

            if (!appointment) {
                const existingAppointment = await Appointment.findOne({ _id: appointmentId, userId: userId });

                if (existingAppointment && existingAppointment.cancelado) {
                    return renderError(res, 'Este agendamento já está cancelado.');
                } else {
                    return renderError(res, 'Agendamento não encontrado ou você não tem permissão para cancelá-lo.', 404);
                }
            }

            logger.info('Agendamento cancelado por profissional', { appointmentId: appointment._id });
            return renderJson(res, true, 'Agendamento cancelado com sucesso!');

        } catch (error) {
            logger.error('Erro ao cancelar agendamento (profissional):', error);
            return renderError(res, 'Erro interno do servidor ao cancelar agendamento.');
        }
    },

    updateAppointment: async (req, res) => {
        const { appointmentId } = req.params;
        const userId = req.session.user_id;
        const { serviceId, start, duracao_min, nomeCliente, telefoneCliente } = req.body;
        logger.info('Tentativa de atualizar agendamento', { appointmentId, body: req.body, userId });

        if (!serviceId || !start || !duracao_min || !nomeCliente || !telefoneCliente) {
            return renderError(res, 'Todos os campos de agendamento são obrigatórios para a edição.', 400);
        }

        try {
            const appointmentStart = new Date(start);
            const appointmentEnd = new Date(appointmentStart.getTime() + duracao_min * 60 * 1000);

            const overlappingAppointment = await Appointment.findOne({
                _id: { $ne: appointmentId },
                userId: userId,
                cancelado: false,
                $or: [
                    { start: { $lt: appointmentEnd, $gte: appointmentStart } },
                    { end: { $gt: appointmentStart, $lte: appointmentEnd } },
                    { start: { $lte: appointmentStart }, end: { $gte: appointmentEnd } }
                ]
            });
            if (overlappingAppointment) {
                return renderError(res, 'O novo horário está indisponível. Há um conflito com outro agendamento.');
            }

            const updatedAppointment = await Appointment.findOneAndUpdate(
                { _id: appointmentId, userId: userId },
                {
                    serviceId,
                    start: appointmentStart,
                    end: appointmentEnd,
                    duracao_min,
                    nomeCliente,
                    telefoneCliente
                },
                { new: true, runValidators: true }
            );

            if (!updatedAppointment) {
                return renderError(res, 'Agendamento não encontrado ou você não tem permissão para editá-lo.', 404);
            }

            logger.info('Agendamento atualizado com sucesso', { appointmentId: updatedAppointment._id });
            return renderJson(res, true, 'Agendamento atualizado com sucesso!', false, updatedAppointment);

        } catch (error) {
            logger.error('Erro ao atualizar agendamento:', error);
            return renderError(res, 'Erro interno do servidor ao atualizar agendamento.');
        }
    },

    getAgendamentosCliente: async (req, res) => {
        const { pro_id, telefone } = req.query;
        logger.info('Tentativa de obter agendamentos do cliente', { pro_id, telefone });

        if (!pro_id || !telefone) {
            return renderError(res, 'ID do profissional e telefone são obrigatórios.', 400);
        }

        try {
            const appointments = await Appointment.find({
                userId: pro_id,
                telefoneCliente: telefone
            })
                .sort({ start: -1 })
                .populate('serviceId');

            if (appointments.length === 0) {
                return renderJson(res, true, 'Nenhum agendamento encontrado.', false, []);
            }

            const appointmentsWithStatus = appointments.map(app => {
                const appObject = app.toObject();
                appObject.status = getAppointmentStatus(app);
                return appObject;
            });

            return renderJson(res, true, 'Agendamentos obtidos com sucesso.', false, appointmentsWithStatus);
        } catch (error) {
            logger.error('Erro ao buscar agendamentos do cliente:', error);
            return renderError(res, 'Erro interno do servidor ao buscar agendamentos.', 500);
        }
    },

    cancelAppointmentCliente: async (req, res) => {
        logger.info('Tentativa de cancelar agendamento (cliente)', { body: req.body });
        const { appointmentId, telefone } = req.body;

        if (!appointmentId || !telefone) {
            return renderError(res, 'ID do agendamento e telefone são obrigatórios para o cancelamento.');
        }

        try {
            const appointment = await Appointment.findOne({
                _id: appointmentId,
                telefoneCliente: telefone
            });

            if (!appointment) {
                return renderError(res, 'Agendamento não encontrado ou dados não conferem.', 404);
            }

            if (appointment.cancelado) {
                return renderError(res, 'Agendamento já está cancelado.');
            }

            const now = new Date();
            const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
            if ((appointment.start.getTime() - now.getTime()) < twoHoursInMilliseconds) {
                return renderError(res, 'Não é possível cancelar agendamentos com menos de 2 horas de antecedência.');
            }

            const updatedAppointment = await Appointment.findOneAndUpdate(
                { _id: appointmentId },
                { cancelado: true },
                { new: true }
            );

            logger.info('Agendamento cancelado por cliente', { appointmentId: updatedAppointment._id });
            return renderJson(res, true, 'Agendamento cancelado com sucesso!');

        } catch (error) {
            logger.error('Erro ao cancelar agendamento (cliente):', error);
            return renderError(res, 'Erro interno do servidor ao cancelar agendamento.');
        }
    },

    getAppointmentById: async (req, res) => {
        const { appointmentId } = req.params;
        const userId = req.session.user_id;

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', true);
        }
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return renderError(res, 'ID do agendamento inválido.', 400);
        }

        try {
            const appointment = await Appointment.findOne({
                _id: appointmentId,
                userId: userId
            }).populate('serviceId', 'nome duracao_min');

            if (!appointment) {
                return renderError(res, 'Agendamento não encontrado ou você não tem permissão para acessá-lo.', 404);
            }

            const appointmentWithStatus = appointment.toObject();
            appointmentWithStatus.status = getAppointmentStatus(appointment);

            logger.info('Agendamento encontrado por ID', { appointmentId });
            return renderJson(res, true, 'Agendamento obtido com sucesso.', false, appointmentWithStatus);
        } catch (error) {
            logger.error('Erro ao obter agendamento por ID:', error);
            return renderError(res, 'Erro interno do servidor ao obter agendamento.');
        }
    },

    // Nova função para obter eventos do calendário
    getCalendarEvents: async (req, res) => {
        const userId = req.session.user_id;
        const { start, end } = req.query;

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', 401, true);
        }

        try {
            let dateFilter = { userId };
            
            if (start && end) {
                dateFilter.start = {
                    $gte: new Date(start),
                    $lte: new Date(end)
                };
            }

            const appointments = await Appointment.find(dateFilter)
                .populate('serviceId', 'nome tipo preco')
                .sort({ start: 1 })
                .lean();

            const events = appointments.map(appointment => {
                let status = 'agendado';
                let backgroundColor = '#f59e0b'; // amber-500 for agendado
                
                if (appointment.status) {
                    status = appointment.status;
                } else if (appointment.cancelado) {
                    status = 'cancelado';
                } else if (appointment.end && new Date(appointment.end) < new Date()) {
                    status = 'concluido';
                }

                // Definir cores por status
                switch (status) {
                    case 'confirmado':
                        backgroundColor = '#3b82f6'; // blue-500
                        break;
                    case 'concluido':
                        backgroundColor = '#10b981'; // emerald-500
                        break;
                    case 'cancelado':
                        backgroundColor = '#ef4444'; // red-500
                        break;
                    case 'em_andamento':
                        backgroundColor = '#8b5cf6'; // violet-500
                        break;
                    case 'nao_compareceu':
                        backgroundColor = '#6b7280'; // gray-500
                        break;
                    default:
                        backgroundColor = '#f59e0b'; // amber-500 for agendado
                }

                return {
                    id: appointment._id,
                    title: `${appointment.nomeCliente} - ${appointment.serviceId?.nome || 'Serviço'}`,
                    start: appointment.start,
                    end: appointment.end,
                    backgroundColor,
                    borderColor: backgroundColor,
                    extendedProps: {
                        clientName: appointment.nomeCliente,
                        clientPhone: appointment.telefoneCliente,
                        service: appointment.serviceId?.nome || 'Serviço',
                        serviceType: appointment.serviceId?.tipo,
                        price: appointment.serviceId?.preco,
                        status,
                        observations: appointment.observacoes
                    }
                };
            });

            logger.info('Eventos do calendário carregados', { userId, count: events.length });
            return renderJson(res, true, 'Eventos carregados com sucesso', false, events);

        } catch (error) {
            logger.error('Erro ao carregar eventos do calendário:', error);
            return renderError(res, 'Erro ao carregar eventos do calendário');
        }
    },

    // Nova função para estatísticas do dashboard
    getAppointmentStats: async (req, res) => {
        const userId = req.session.user_id;
        const { period = 'month' } = req.query;

        if (!userId) {
            return renderError(res, 'Sessão expirada. Faça login novamente.', 401, true);
        }

        try {
            const now = new Date();
            let startDate, endDate;

            // Definir período baseado no parâmetro
            switch (period) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                    break;
                case 'week':
                    const dayOfWeek = now.getDay();
                    startDate = new Date(now.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000));
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
                    break;
                case 'month':
                default:
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    endDate.setHours(23, 59, 59, 999);
                    break;
            }

            // Buscar agendamentos do período
            const appointments = await Appointment.find({
                userId,
                start: { $gte: startDate, $lte: endDate }
            }).populate('serviceId', 'preco').lean();

            // Calcular estatísticas
            const stats = {
                total: appointments.length,
                agendado: appointments.filter(apt => !apt.status || apt.status === 'agendado').length,
                confirmado: appointments.filter(apt => apt.status === 'confirmado').length,
                concluido: appointments.filter(apt => apt.status === 'concluido').length,
                cancelado: appointments.filter(apt => apt.status === 'cancelado').length,
                revenue: appointments
                    .filter(apt => apt.status === 'concluido')
                    .reduce((sum, apt) => sum + (apt.serviceId?.preco || 0), 0),
                period,
                startDate,
                endDate
            };

            // Calcular agendamentos de hoje
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayAppointments = await Appointment.find({
                userId,
                start: { $gte: today, $lt: tomorrow }
            }).countDocuments();

            stats.today = todayAppointments;

            logger.info('Estatísticas calculadas', { userId, period, stats });
            return renderJson(res, true, 'Estatísticas carregadas com sucesso', false, stats);

        } catch (error) {
            logger.error('Erro ao calcular estatísticas:', error);
            return renderError(res, 'Erro ao calcular estatísticas');
        }
    }
};

module.exports = appointmentController;