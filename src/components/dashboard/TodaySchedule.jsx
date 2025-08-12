import { useState, useEffect } from 'react';
import api from '../../services/api';

const TodaySchedule = ({ onAppointmentClick }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayAppointments();
  }, []);

  const loadTodayAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agendamentos/hoje');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos de hoje:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.put(`/update_appointment/${appointmentId}`, { status: newStatus });
      loadTodayAppointments(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'concluido':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'cancelado':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'em_andamento':
        return 'bg-violet-100 dark:bg-violet-900/20 text-violet-800 dark:text-violet-400';
      default:
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado':
        return '✓';
      case 'concluido':
        return '✅';
      case 'cancelado':
        return '❌';
      case 'em_andamento':
        return '🔄';
      default:
        return '⏰';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateRange = (start, end) => {
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    return `${startTime} - ${endTime}`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0c1427] rounded-[25px] p-6 shadow-sm border border-gray-100 dark:border-[#172036]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0c1427] rounded-[25px] p-6 shadow-sm border border-gray-100 dark:border-[#172036] h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            📅 Agenda de Hoje
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
        
        {appointments.length > 0 && (
          <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {appointments.length} agendamento{appointments.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Lista de agendamentos */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">😌</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Nenhum agendamento para hoje
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
              Aproveite o dia de folga!
            </p>
          </div>
        ) : (
          appointments.map((appointment) => {
            const status = appointment.extendedProps?.status || 'agendado';
            const canUpdate = status === 'agendado';
            
            return (
              <div
                key={appointment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onAppointmentClick && onAppointmentClick(appointment)}
              >
                {/* Tempo e Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatDateRange(appointment.start, appointment.end)}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status)}`}>
                    {getStatusIcon(status)} {status}
                  </span>
                </div>

                {/* Informações do cliente */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.extendedProps?.clientName || appointment.title}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    📞 {appointment.extendedProps?.clientPhone}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    💅 {appointment.extendedProps?.service}
                  </div>

                  {appointment.extendedProps?.observations && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                      💬 {appointment.extendedProps.observations}
                    </div>
                  )}

                  {appointment.extendedProps?.price && (
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      💰 R$ {appointment.extendedProps.price}
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                {canUpdate && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, 'confirmado');
                      }}
                      className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors"
                    >
                      ✓ Confirmar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, 'em_andamento');
                      }}
                      className="flex-1 text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-md transition-colors"
                    >
                      🔄 Iniciar
                    </button>
                  </div>
                )}

                {status === 'confirmado' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, 'em_andamento');
                      }}
                      className="flex-1 text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-md transition-colors"
                    >
                      🔄 Iniciar Atendimento
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, 'cancelado');
                      }}
                      className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                )}

                {status === 'em_andamento' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, 'concluido');
                      }}
                      className="w-full text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      ✅ Concluir Atendimento
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Botão para ver mais */}
      {appointments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => window.location.href = '/dashboard-pro?view=appointments'}
            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Ver todos os agendamentos →
          </button>
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;