// arquivo: routes.js

const { Router } = require('express');
const router = Router();

// =====================================================
// Importa middlewares
// =====================================================
const { requireAuth, checkUserType } = require('./middlewares/authMiddleware');

// =====================================================
// Importa seus controladores
// =====================================================
const authController = require('./controles/authController');
const appointmentController = require('./controles/appointmentController');
const scheduleController = require('./controles/scheduleController');
const serviceController = require('./controles/serviceController');
const publicBookingController = require('./controles/publicBookingController');

// =====================================================
// Rotas de Acesso Público para Clientes e Visualização de Dados
// =====================================================
// Rota de boas-vindas da API (geralmente usada para verificar se o servidor está online)
// Test route FIRST
router.get('/test', (req, res) => {
    console.log('🔧 DEBUG: Test route called!');
    return res.status(200).json({ 
        message: 'Test route works!',
        timestamp: new Date().toISOString()
    });
});

router.get('/', (req, res) => {
    console.log('🔧 DEBUG: Root API route called!');
    return res.status(200).json({ 
        message: 'Welcome to the API! Routes updated!',
        timestamp: new Date().toISOString(),
        routes_loaded: true 
    });
});

// Rotas públicas para autenticação de usuários
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/check_session', authController.checkSession);

// Rotas públicas para cliente (antigas - mantidas por compatibilidade)
router.get('/get_servicos_cliente', serviceController.getServicosCliente);
router.get('/get_horarios_disponiveis', scheduleController.getHorariosDisponiveis);
router.post('/agendamentos', appointmentController.createAppointment);
router.get('/get_agendamentos_cliente', appointmentController.getAgendamentosCliente);
router.post('/cancel_appointment_cliente', appointmentController.cancelAppointmentCliente);

// =====================================================
// Novas Rotas Públicas para Sistema de Manicure
// =====================================================
// Rotas para agendamento público sem necessidade de login
router.get('/public/services', publicBookingController.getServices);
router.get('/public/appointments/:phone', publicBookingController.getAppointmentsByPhone);
router.post('/public/appointments', publicBookingController.createAppointment);
router.delete('/public/appointments/:appointmentId', publicBookingController.cancelAppointment);
router.get('/public/available-slots', publicBookingController.getAvailableSlots);

// =====================================================
// Rotas de Acesso Exclusivo para Usuários Autenticados (Profissionais e Clientes)
// =====================================================
router.post('/logout', requireAuth, authController.logout);

// Rota para obter dados do usuário logado (pode ser cliente ou profissional)
router.get('/user_data', requireAuth, appointmentController.getUserData);

// =====================================================
// Rotas de Acesso Exclusivo para Profissionais
// =====================================================
router.get('/get_profissional_data', requireAuth, checkUserType(['profissional']), authController.getProfissionalData);

// Rotas de Serviços do Profissional
router.post('/add_servico', requireAuth, checkUserType(['profissional']), serviceController.addServico);
router.get('/servicos', requireAuth, checkUserType(['profissional']), serviceController.getServicos);
router.get('/servicos/:id', requireAuth, checkUserType(['profissional']), serviceController.getServicoById);
router.delete('/delete_servico/:id', requireAuth, checkUserType(['profissional']), serviceController.deleteServico);

// Rotas de Horários de Funcionamento do Profissional
router.post('/set_horario_funcionamento', requireAuth, checkUserType(['profissional']), scheduleController.setHorarioFuncionamento);
router.get('/get_horarios_funcionamento', requireAuth, checkUserType(['profissional']), scheduleController.getHorariosFuncionamento);
router.delete('/delete_horario_funcionamento/:id', requireAuth, checkUserType(['profissional']), scheduleController.deleteHorarioFuncionamento);

// Rotas de Agendamentos e Calendário do Profissional
router.get('/agendamentos', requireAuth, checkUserType(['profissional']), appointmentController.getAgendamentos);
router.get('/agendamentos/hoje', requireAuth, checkUserType(['profissional']), appointmentController.getAgendamentosHoje);
router.get('/agendamentos/calendar', requireAuth, checkUserType(['profissional']), appointmentController.getCalendarEvents);
router.get('/agendamentos/stats', requireAuth, checkUserType(['profissional']), appointmentController.getAppointmentStats);
router.get('/agendamentos/:appointmentId', requireAuth, checkUserType(['profissional']), appointmentController.getAppointmentById);
router.post('/cancel_appointment_profissional', requireAuth, checkUserType(['profissional']), appointmentController.cancelAppointmentProfissional);
router.put('/update_appointment/:appointmentId', requireAuth, checkUserType(['profissional']), appointmentController.updateAppointment);
router.get('/agendamentos-cancelados', requireAuth, checkUserType(['profissional']), appointmentController.getAgendamentosCancelados);

// Rotas de Clientes do Profissional
router.get('/clientes', requireAuth, checkUserType(['profissional']), appointmentController.getClientes);

module.exports = router;