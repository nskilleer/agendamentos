import { useState } from 'react';

const CalendarFilters = ({ onPeriodChange, onViewChange, currentView = 'dayGridMonth' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const periods = [
    { value: 'day', label: 'Dia', icon: '📅' },
    { value: 'week', label: 'Semana', icon: '📆' },
    { value: 'month', label: 'Mês', icon: '🗓️' }
  ];

  const views = [
    { value: 'dayGridMonth', label: 'Mês', icon: '🗓️' },
    { value: 'timeGridWeek', label: 'Semana', icon: '📆' },
    { value: 'timeGridDay', label: 'Dia', icon: '📅' },
    { value: 'listWeek', label: 'Lista', icon: '📋' }
  ];

  const statusFilters = [
    { value: 'all', label: 'Todos', color: 'gray' },
    { value: 'agendado', label: 'Agendado', color: 'amber' },
    { value: 'confirmado', label: 'Confirmado', color: 'blue' },
    { value: 'concluido', label: 'Concluído', color: 'emerald' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'violet' }
  ];

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  const handleViewChange = (view) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Aqui você pode implementar a lógica de filtro por status
    // Por exemplo, passando o filtro para o componente pai
  };

  const getButtonClass = (isActive, colorClass = 'blue') => {
    const baseClass = "px-3 py-2 text-sm font-medium rounded-lg transition-colors";
    if (isActive) {
      return `${baseClass} bg-${colorClass}-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-${colorClass}-50 dark:hover:bg-${colorClass}-900/20 hover:text-${colorClass}-600 dark:hover:text-${colorClass}-400`;
  };

  return (
    <div className="bg-white dark:bg-[#0c1427] rounded-[25px] p-6 shadow-sm border border-gray-100 dark:border-[#172036] mb-6">
      <div className="space-y-4">
        {/* Filtros de Visualização */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            🔍 Visualização
          </h4>
          <div className="flex flex-wrap gap-2">
            {views.map((view) => (
              <button
                key={view.value}
                onClick={() => handleViewChange(view.value)}
                className={getButtonClass(currentView === view.value)}
              >
                {view.icon} {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros de Status */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            🏷️ Status
          </h4>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  selectedStatus === status.value
                    ? `bg-${status.color}-600 text-white`
                    : `bg-${status.color}-100 dark:bg-${status.color}-900/20 text-${status.color}-800 dark:text-${status.color}-400 hover:bg-${status.color}-200 dark:hover:bg-${status.color}-900/40`
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros de Período para Estatísticas */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            📊 Período das Estatísticas
          </h4>
          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={getButtonClass(selectedPeriod === period.value, 'purple')}
              >
                {period.icon} {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            ⚡ Ações Rápidas
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              🔄 Atualizar
            </button>
            
            <button
              onClick={() => {
                const today = new Date();
                // Aqui você pode implementar a lógica para ir para hoje
                console.log('Navegar para hoje:', today);
              }}
              className="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
            >
              📅 Ir para Hoje
            </button>

            <button
              onClick={() => {
                // Aqui você pode implementar a lógica para exportar
                console.log('Exportar calendário');
              }}
              className="px-3 py-2 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
            >
              📄 Exportar
            </button>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">📈</div>
              <div className="text-xs text-blue-800 dark:text-blue-400 font-medium">Taxa Conclusão</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">85%</div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">💰</div>
              <div className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">Receita Hoje</div>
              <div className="text-sm text-emerald-600 dark:text-emerald-400">R$ 320</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;