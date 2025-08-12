import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import AppointmentCalendar from '../components/dashboard/AppointmentCalendar';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import CalendarFilters from '../components/dashboard/CalendarFilters';
import StatsCards from '../components/dashboard/StatsCards';

function DashboardPro() {
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [services, setServices] = useState([]);
  const [view, setView] = useState('calendar');
  const [loading, setLoading] = useState(false);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [statsPeriod, setStatsPeriod] = useState('month');
  const { user } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await loadAppointments();
    await loadSchedules();
    await loadServices();
  };

  const loadAppointments = async () => {
    try {
      const response = await api.get('/agendamentos');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAppointments([]);
    }
  };

  const loadSchedules = async () => {
    try {
      const response = await api.get('/get_horarios_funcionamento');
      if (response.data.success) {
        setSchedules(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setSchedules([]);
    }
  };

  const loadServices = async () => {
    try {
      const response = await api.get('/servicos');
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServices([]);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await api.put(`/update_appointment/${appointmentId}`, { status });
      if (response.data.success) {
        loadAppointments();
      }
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const deleteService = async (serviceId) => {
    if (!confirm('Deseja excluir este serviço?')) return;
    
    try {
      const response = await api.delete(`/delete_servico/${serviceId}`);
      if (response.data.success) {
        loadServices();
      }
    } catch (error) {
      alert('Erro ao excluir serviço');
    }
  };

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    // Aqui você pode abrir um modal com detalhes do agendamento
  };

  const handleDateClick = (dateInfo) => {
    console.log('Date clicked:', dateInfo.dateStr);
    // Aqui você pode abrir um modal para criar um novo agendamento
  };

  const handleAppointmentClick = (appointment) => {
    console.log('Appointment clicked:', appointment);
    // Aqui você pode implementar a lógica para editar/visualizar o agendamento
  };

  const renderCalendarDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black dark:text-white text-2xl font-bold mb-[5px]">
            📅 Calendário de Agendamentos - {user?.nome}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visualize e gerencie seus agendamentos de manicure
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('services')}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            ⚙️ Serviços
          </button>
          <button
            onClick={() => setView('appointments')}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            📋 Lista Completa
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards period={statsPeriod} />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Filters - Mobile/Tablet: full width, Desktop: 1 column */}
        <div className="xl:col-span-1 order-first xl:order-none">
          <CalendarFilters 
            onPeriodChange={setStatsPeriod}
            onViewChange={setCalendarView}
            currentView={calendarView}
          />
        </div>
        
        {/* Main Calendar and Today's Schedule */}
        <div className="xl:col-span-3 space-y-6">
          {/* Calendar takes 2/3 of remaining space on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AppointmentCalendar 
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                height="650px"
              />
            </div>
            
            {/* Today's Schedule takes 1/3 of remaining space */}
            <div className="lg:col-span-1">
              <TodaySchedule onAppointmentClick={handleAppointmentClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agendamentos</h1>
      
      <Card>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{apt.clientName}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{apt.serviceName}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      apt.status === 'confirmado' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                      apt.status === 'cancelado' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                      apt.status === 'concluido' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' :
                      'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>📅 {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time}</p>
                    <p>📞 {apt.clientPhone}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {apt.status === 'agendado' && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(apt._id, 'confirmado')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt._id, 'cancelado')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {apt.status === 'confirmado' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt._id, 'concluido')}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">Nenhum agendamento encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Serviços</h1>
        <Link
          to="/services"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Serviço
        </Link>
      </div>
      
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.nome}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{service.descricao}</p>
                  </div>
                  <button
                    onClick={() => deleteService(service._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    R$ {service.preco}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {service.duracao} min
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum serviço cadastrado</p>
            <Link
              to="/services"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Criar Primeiro Serviço
            </Link>
          </div>
        </Card>
      )}
    </div>
  );

  const renderSchedules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minha Agenda</h1>
        <Link
          to="/schedule"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Gerenciar Agenda
        </Link>
      </div>
      
      {schedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule._id}>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {schedule.diaSemana}
                  </h3>
                </div>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {schedule.horaInicio} - {schedule.horaFim}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Intervalo: {schedule.intervalo} min
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma agenda configurada</p>
            <Link
              to="/schedule"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Configurar Agenda
            </Link>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      {view === 'calendar' && renderCalendarDashboard()}
      {view === 'appointments' && renderAppointments()}
      {view === 'services' && renderServices()}
      {view === 'schedules' && renderSchedules()}
    </DashboardLayout>
  );
}

export default DashboardPro;