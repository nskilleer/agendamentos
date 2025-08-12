import { useState } from 'react';
import api from '../../services/api';

function ClientAppointments({ appointments, clientPhone, onBackToMenu, onAppointmentUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.delete(`/public/appointments/${appointmentId}`, {
        data: { telefoneCliente: clientPhone }
      });

      if (response.data.success) {
        alert('Agendamento cancelado com sucesso!');
        
        // Atualizar a lista removendo o agendamento cancelado
        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
        onAppointmentUpdate(updatedAppointments);
      } else {
        setError(response.data.message || 'Erro ao cancelar agendamento');
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setError(error.response?.data?.message || 'Erro ao cancelar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'confirmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'concluido':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'nao_compareceu':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'confirmado':
        return 'Confirmado';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      case 'nao_compareceu':
        return 'Não Compareceu';
      default:
        return status;
    }
  };

  const isPastAppointment = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(b.data) - new Date(a.data); // Mais recentes primeiro
  });

  const upcomingAppointments = sortedAppointments.filter(apt => 
    !isPastAppointment(apt.data) && apt.status !== 'cancelado'
  );
  
  const pastAppointments = sortedAppointments.filter(apt => 
    isPastAppointment(apt.data) || apt.status === 'cancelado'
  );

  return (
    <div className="bg-white dark:bg-[#1a1d29] rounded-[25px] p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToMenu}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ← Voltar ao Menu
        </button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {clientPhone}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Seus Agendamentos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Total de {appointments.length} agendamento(s) encontrado(s)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🗓️</div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Você ainda não possui nenhum agendamento
          </p>
          <button
            onClick={onBackToMenu}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Fazer Primeiro Agendamento
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Próximos Agendamentos */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="text-green-500 mr-2">🟢</span>
                Próximos Agendamentos ({upcomingAppointments.length})
              </h3>
              
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white mr-3">
                            {appointment.servico?.nome}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p className="flex items-center">
                            <span className="mr-2">📅</span>
                            {formatDate(appointment.data)}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">⏰</span>
                            {formatTime(appointment.data)} ({appointment.servico?.duracao} min)
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">💅</span>
                            {appointment.profissional}
                          </p>
                          {appointment.observacoes && (
                            <p className="flex items-center">
                              <span className="mr-2">📝</span>
                              {appointment.observacoes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                          R$ {appointment.servico?.preco?.toFixed(2)}
                        </div>
                        
                        {appointment.podeCancelar && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm underline disabled:opacity-50"
                          >
                            {loading ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Histórico */}
          {pastAppointments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="text-gray-500 mr-2">⚪</span>
                Histórico ({pastAppointments.length})
              </h3>
              
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-75"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white mr-3">
                            {appointment.servico?.nome}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p className="flex items-center">
                            <span className="mr-2">📅</span>
                            {formatDate(appointment.data)}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">⏰</span>
                            {formatTime(appointment.data)}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">💅</span>
                            {appointment.profissional}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                          R$ {appointment.servico?.preco?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ação para novo agendamento */}
      {appointments.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={onBackToMenu}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      )}
    </div>
  );
}

export default ClientAppointments;