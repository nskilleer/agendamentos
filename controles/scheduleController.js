// Arquivo: scheduleController.js

const logger = require('../configuracoes/logger');
const { renderJson, renderError } = require('../utils/helpers');
const Schedule = require('../models/Schedule');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

const scheduleController = {
    //===========================================================================================================
    //Define ou atualiza os horários de funcionamento para o profissional logado em um dia da semana específico.
    //Requer autenticação.
    //===========================================================================================================
    setHorarioFuncionamento: async (req, res) => {
        logger.info('Tentativa de definir horário de funcionamento', { user_id: req.session.user_id, body: req.body });

        const { dia_semana, hora_abertura, hora_fechamento } = req.body;
        const profissionalId = req.session.user_id;

        if (!dia_semana || !hora_abertura || !hora_fechamento || !profissionalId) {
            return renderError(res, 'Todos os campos (dia da semana, hora de abertura, hora de fechamento) são obrigatórios.', 400);
        }

        try {
            const updatedSchedule = await Schedule.findOneAndUpdate(
                { userId: profissionalId, dia_semana: dia_semana },
                { hora_abertura: hora_abertura, hora_fechamento: hora_fechamento },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            logger.info('Horário de funcionamento definido com sucesso', { scheduleId: updatedSchedule._id, profissionalId, dia_semana });
            renderJson(res, true, 'Horário de funcionamento definido com sucesso!', false, updatedSchedule);

        } catch (err) {
            logger.error('Erro ao definir horário de funcionamento:', err);
            renderError(res, 'Erro ao definir horário de funcionamento. Por favor, tente novamente mais tarde.');
        }
    },

    //==========================================================================================
    //Obtém todos os horários de funcionamento associados ao profissional logado.
    //Requer autenticação.
    //==========================================================================================
    getHorariosFuncionamento: async (req, res) => {
        logger.info('Tentativa de obter horários de funcionamento', { user_id: req.session.user_id });
        const profissionalId = req.session.user_id;

        const ordemDiasSemana = {
            'domingo': 0,
            'segunda': 1,
            'terca': 2,
            'quarta': 3,
            'quinta': 4,
            'sexta': 5,
            'sabado': 6
        };

        try {
            const horarios = await Schedule.find({ userId: profissionalId });

            horarios.sort((a, b) => {
                const diaA = ordemDiasSemana[a.dia_semana];
                const diaB = ordemDiasSemana[b.dia_semana];

                if (diaA !== diaB) {
                    return diaA - diaB;
                }

                return a.hora_abertura.localeCompare(b.hora_abertura);
            });

            logger.info('Horários de funcionamento encontrados', { user_id: profissionalId, count: horarios.length });
            renderJson(res, true, 'Horários de funcionamento obtidos com sucesso.', false, horarios);

        } catch (err) {
            logger.error('Erro ao obter horários de funcionamento:', err);
            renderError(res, 'Erro ao obter horários de funcionamento. Por favor, tente novamente mais tarde.');
        }
    },

    //==========================================================================================
    // Obtém horários disponíveis para agendamento de um profissional específico em uma data.
    //==========================================================================================
    getHorariosDisponiveis: async (req, res) => {
        logger.info('Tentativa de obter horários disponíveis (público)', { query: req.query });
        const { pro_id, serviceId, date } = req.query;

        if (!pro_id || !serviceId || !date) {
            return renderError(res, 'ID do profissional, ID do serviço e data são obrigatórios.');
        }

        if (!mongoose.Types.ObjectId.isValid(pro_id) || !mongoose.Types.ObjectId.isValid(serviceId)) {
            return renderError(res, 'ID do profissional ou serviço inválido.');
        }

        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return renderError(res, 'Data inválida.');
            }

            const diaSemanaArray = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
            const diaSemana = diaSemanaArray[parsedDate.getDay()];

            const horarioFuncionamento = await Schedule.findOne({ userId: pro_id, dia_semana: diaSemana });
            if (!horarioFuncionamento) {
                return renderJson(res, true, 'Profissional não tem horário de funcionamento definido para este dia.', false, []);
            }

            const servicoSelecionado = await Service.findById(serviceId);
            if (!servicoSelecionado) {
                return renderError(res, 'Serviço não encontrado.');
            }
            const serviceDuration = servicoSelecionado.duracao_min;

            const [openHour, openMinute] = horarioFuncionamento.hora_abertura.split(':').map(Number);
            const [closeHour, closeMinute] = horarioFuncionamento.hora_fechamento.split(':').map(Number);

            const openTime = new Date(parsedDate);
            openTime.setHours(openHour, openMinute, 0, 0);

            const closeTime = new Date(parsedDate);
            closeTime.setHours(closeHour, closeMinute, 0, 0);

            //garante que não haja agendamentos cancelados
            const agendamentosExistentes = await Appointment.find({
                userId: pro_id,
                start: { $gte: openTime, $lte: closeTime },
                cancelado: false
            }).sort('start');

            const availableSlots = [];
            let currentSlot = openTime;

            const now = new Date();

            while (currentSlot.getTime() + serviceDuration * 60 * 1000 <= closeTime.getTime()) {
                let slotEnd = new Date(currentSlot.getTime() + serviceDuration * 60 * 1000);

                // FILTRANDO AGENDAMENTOS 'concluídos' dinamicamente
                const isBooked = agendamentosExistentes.some(appointment => {
                    const appointmentStart = new Date(appointment.start);
                    const appointmentEnd = new Date(appointment.start.getTime() + appointment.duracao_min * 60 * 1000);

                    // Verifica se o agendamento já passou ou se há um conflito de horário
                    const isConcluido = appointmentEnd < now;

                    return !isConcluido && (
                        (currentSlot.getTime() < appointmentEnd.getTime() && slotEnd.getTime() > appointmentStart.getTime())
                    );
                });

                if (!isBooked) {
                    availableSlots.push(currentSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                }

                currentSlot = slotEnd;
            }

            logger.info('Horários disponíveis encontrados', { pro_id, date, count: availableSlots.length });
            renderJson(res, true, 'Horários disponíveis obtidos com sucesso.', false, availableSlots);

        } catch (err) {
            logger.error('Erro ao obter horários disponíveis:', err);
            renderError(res, 'Erro ao obter horários disponíveis. Por favor, tente novamente mais tarde.');
        }
    },

    //==========================================================================================
    //Exclui um horário de funcionamento específico do profissional logado.
    //Requer autenticação.
    //==========================================================================================
    deleteHorarioFuncionamento: async (req, res) => {
        const { id } = req.params;
        const profissionalId = req.session.user_id;

        logger.info('Tentativa de excluir horário de funcionamento', { scheduleId: id, profissionalId });

        if (!id) {
            return renderError(res, 'O ID do horário de funcionamento é obrigatório.');
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return renderError(res, 'ID do horário de funcionamento inválido.');
        }

        try {
            const deletedSchedule = await Schedule.findOneAndDelete({ _id: id, userId: profissionalId });

            if (!deletedSchedule) {
                logger.warn('Horário de funcionamento não encontrado ou não pertence ao profissional', { scheduleId: id, profissionalId });
                return renderError(res, 'Horário de funcionamento não encontrado ou você não tem permissão para excluí-lo.');
            }

            logger.info('Horário de funcionamento excluído com sucesso', { scheduleId: id, profissionalId });
            renderJson(res, true, 'Horário de funcionamento excluído com sucesso!', false);

        } catch (err) {
            logger.error('Erro ao excluir horário de funcionamento:', err);
            renderError(res, 'Erro ao excluir horário de funcionamento. Por favor, tente novamente mais tarde.');
        }
    }
};

module.exports = scheduleController;