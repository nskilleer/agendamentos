// controles/publicBookingController.js
// Controlador para agendamentos públicos (sem necessidade de login)

const logger = require('../configuracoes/logger');
const { renderJson, renderError } = require('../utils/helpers');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Schedule = require('../models/Schedule');

const publicBookingController = {
    /**
     * Lista todos os serviços de manicure disponíveis
     */
    getServices: async (req, res) => {
        try {
            // Busca todos os serviços ativos de manicure
            const services = await Service.find({ 
                ativo: true,
                tipo: { $in: ['manicure_1', 'manicure_2', 'manicure_3', 'manicure_4'] }
            })
            .populate('userId', 'nome')
            .sort({ tipo: 1 })
            .lean();

            logger.info('Serviços públicos listados', { count: services.length });

            return renderJson(res, true, 'Serviços carregados com sucesso', false, {
                services: services.map(service => ({
                    id: service._id,
                    nome: service.nome,
                    tipo: service.tipo,
                    duracao_min: service.duracao_min,
                    preco: service.preco,
                    descricao: service.descricao,
                    profissional: service.userId?.nome
                }))
            });

        } catch (error) {
            logger.error('Erro ao buscar serviços públicos:', error);
            return renderError(res, 'Erro ao carregar serviços');
        }
    },

    /**
     * Busca agendamentos por número de telefone
     */
    getAppointmentsByPhone: async (req, res) => {
        try {
            const { phone } = req.params;

            if (!phone || phone.length < 10) {
                return renderError(res, 'Número de telefone inválido', 400);
            }

            // Remove caracteres não numéricos para busca flexível
            const cleanPhone = phone.replace(/\D/g, '');

            const appointments = await Appointment.find({
                telefoneCliente: { $regex: cleanPhone, $options: 'i' },
                status: { $ne: 'cancelado' }
            })
            .populate('serviceId', 'nome tipo preco duracao_min')
            .populate('userId', 'nome')
            .sort({ start: 1 })
            .lean();

            logger.info('Agendamentos buscados por telefone', { phone: cleanPhone, found: appointments.length });

            const formattedAppointments = appointments.map(apt => ({
                id: apt._id,
                data: apt.start,
                horario: apt.start,
                status: apt.status,
                servico: {
                    nome: apt.serviceId?.nome,
                    tipo: apt.serviceId?.tipo,
                    preco: apt.serviceId?.preco,
                    duracao: apt.serviceId?.duracao_min
                },
                profissional: apt.userId?.nome,
                cliente: apt.nomeCliente,
                telefone: apt.telefoneCliente,
                observacoes: apt.observacoes,
                podeReagendar: apt.status === 'agendado' && new Date(apt.start) > new Date(),
                podeCancelar: apt.status === 'agendado' && new Date(apt.start) > new Date()
            }));

            return renderJson(res, true, 'Agendamentos encontrados', false, {
                appointments: formattedAppointments,
                total: formattedAppointments.length,
                phone: phone
            });

        } catch (error) {
            logger.error('Erro ao buscar agendamentos por telefone:', error);
            return renderError(res, 'Erro ao buscar agendamentos');
        }
    },

    /**
     * Cria um novo agendamento público
     */
    createAppointment: async (req, res) => {
        try {
            const { serviceId, data, horario, nomeCliente, telefoneCliente, observacoes } = req.body;

            // Validações básicas
            if (!serviceId || !data || !horario || !nomeCliente || !telefoneCliente) {
                return renderError(res, 'Todos os campos obrigatórios devem ser preenchidos', 400);
            }

            // Busca o serviço
            const service = await Service.findById(serviceId).populate('userId');
            if (!service || !service.ativo) {
                return renderError(res, 'Serviço não encontrado ou indisponível', 404);
            }

            // Monta o datetime do agendamento
            const appointmentStart = new Date(`${data}T${horario}`);
            const appointmentEnd = new Date(appointmentStart.getTime() + (service.duracao_min * 60000));

            // Verifica se o horário está no passado
            if (appointmentStart < new Date()) {
                return renderError(res, 'Não é possível agendar para datas passadas', 400);
            }

            // Verifica disponibilidade do horário
            const conflictingAppointment = await Appointment.findOne({
                userId: service.userId._id,
                status: { $nin: ['cancelado', 'nao_compareceu'] },
                $or: [
                    {
                        start: { $lt: appointmentEnd },
                        end: { $gt: appointmentStart }
                    }
                ]
            });

            if (conflictingAppointment) {
                return renderError(res, 'Este horário já está ocupado', 409);
            }

            // Cria o agendamento
            const newAppointment = new Appointment({
                userId: service.userId._id,
                serviceId: service._id,
                nomeCliente: nomeCliente.trim(),
                telefoneCliente: telefoneCliente.replace(/\D/g, ''),
                start: appointmentStart,
                end: appointmentEnd,
                duracao_min: service.duracao_min,
                status: 'agendado',
                observacoes: observacoes?.trim()
            });

            await newAppointment.save();

            logger.info('Agendamento público criado', { 
                appointmentId: newAppointment._id,
                client: nomeCliente,
                phone: telefoneCliente,
                service: service.nome
            });

            return renderJson(res, true, 'Agendamento realizado com sucesso!', false, {
                appointment: {
                    id: newAppointment._id,
                    data: appointmentStart.toISOString().split('T')[0],
                    horario: appointmentStart.toTimeString().slice(0, 5),
                    servico: {
                        nome: service.nome,
                        tipo: service.tipo,
                        preco: service.preco,
                        duracao: service.duracao_min
                    },
                    profissional: service.userId.nome,
                    cliente: nomeCliente,
                    telefone: telefoneCliente,
                    status: 'agendado'
                }
            });

        } catch (error) {
            logger.error('Erro ao criar agendamento público:', error);
            return renderError(res, 'Erro ao realizar agendamento');
        }
    },

    /**
     * Cancela um agendamento público
     */
    cancelAppointment: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const { telefoneCliente } = req.body;

            if (!telefoneCliente) {
                return renderError(res, 'Telefone é obrigatório para cancelamento', 400);
            }

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return renderError(res, 'Agendamento não encontrado', 404);
            }

            // Verifica se o telefone bate
            const cleanPhone = telefoneCliente.replace(/\D/g, '');
            const appointmentPhone = appointment.telefoneCliente.replace(/\D/g, '');
            
            if (appointmentPhone !== cleanPhone) {
                return renderError(res, 'Telefone não confere com o agendamento', 403);
            }

            // Verifica se pode cancelar (só agendamentos futuros)
            if (appointment.start <= new Date()) {
                return renderError(res, 'Não é possível cancelar agendamentos passados', 400);
            }

            if (appointment.status === 'cancelado') {
                return renderError(res, 'Agendamento já foi cancelado', 400);
            }

            // Cancela o agendamento
            appointment.status = 'cancelado';
            await appointment.save();

            logger.info('Agendamento público cancelado', { 
                appointmentId: appointment._id,
                client: appointment.nomeCliente
            });

            return renderJson(res, true, 'Agendamento cancelado com sucesso', false, {
                appointmentId: appointment._id
            });

        } catch (error) {
            logger.error('Erro ao cancelar agendamento público:', error);
            return renderError(res, 'Erro ao cancelar agendamento');
        }
    },

    /**
     * Busca horários disponíveis para um serviço em uma data
     */
    getAvailableSlots: async (req, res) => {
        try {
            const { serviceId, data } = req.query;

            if (!serviceId || !data) {
                return renderError(res, 'Serviço e data são obrigatórios', 400);
            }

            const service = await Service.findById(serviceId).populate('userId');
            if (!service || !service.ativo) {
                return renderError(res, 'Serviço não encontrado', 404);
            }

            const targetDate = new Date(data);
            const dayOfWeek = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][targetDate.getDay()];

            // Busca o horário de funcionamento
            const schedule = await Schedule.findOne({
                userId: service.userId._id,
                dia_semana: dayOfWeek
            });

            if (!schedule) {
                return renderJson(res, true, 'Horários carregados', false, {
                    availableSlots: [],
                    message: 'Profissional não trabalha neste dia'
                });
            }

            // Gera slots de 45 minutos
            const slots = [];
            const [openHour, openMin] = schedule.hora_abertura.split(':').map(Number);
            const [closeHour, closeMin] = schedule.hora_fechamento.split(':').map(Number);
            
            let currentTime = new Date(targetDate);
            currentTime.setHours(openHour, openMin, 0, 0);
            
            const endTime = new Date(targetDate);
            endTime.setHours(closeHour, closeMin, 0, 0);

            // Busca agendamentos existentes para o dia
            const dayStart = new Date(targetDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(targetDate);
            dayEnd.setHours(23, 59, 59, 999);

            const existingAppointments = await Appointment.find({
                userId: service.userId._id,
                status: { $nin: ['cancelado', 'nao_compareceu'] },
                start: { $gte: dayStart, $lte: dayEnd }
            });

            // Gera todos os slots possíveis
            while (currentTime < endTime) {
                const slotEnd = new Date(currentTime.getTime() + (45 * 60000));
                
                // Verifica se o slot não conflita com agendamentos existentes
                const isAvailable = !existingAppointments.some(apt => 
                    (currentTime < new Date(apt.end) && slotEnd > new Date(apt.start))
                );

                // Verifica se não é no passado
                const isPast = currentTime <= new Date();

                if (isAvailable && !isPast) {
                    slots.push({
                        time: currentTime.toTimeString().slice(0, 5),
                        datetime: currentTime.toISOString(),
                        available: true
                    });
                }

                // Próximo slot (45 minutos depois)
                currentTime = new Date(currentTime.getTime() + (45 * 60000));
            }

            return renderJson(res, true, 'Horários carregados com sucesso', false, {
                availableSlots: slots,
                date: data,
                service: service.nome,
                workingHours: {
                    open: schedule.hora_abertura,
                    close: schedule.hora_fechamento
                }
            });

        } catch (error) {
            logger.error('Erro ao buscar horários disponíveis:', error);
            return renderError(res, 'Erro ao buscar horários disponíveis');
        }
    }
};

module.exports = publicBookingController;